import xgboost as xgb
import numpy as np
import pandas as pd
import logging
import hashlib
import joblib
import torch

from pathlib import Path
from transformers import BertTokenizer, BertModel
from gensim.models import Word2Vec
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
from torch.utils.data import DataLoader
from datetime import datetime

target_var = 'completed'
    
logging.basicConfig(
    filename='recommender.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert_model = BertModel.from_pretrained("bert-base-uncased")
is_rf = False
n_estimators = 100
model_file_name = "recommender_model.pkl" if not is_rf else "rf_model.pkl"

def skill_col_name(col_name, is_user=False):
    prefix = "user_" if is_user else ""
    return f"{prefix}skill_{hashlib.md5(col_name.encode()).hexdigest()[:8]}"

def collate_fn(batch):
    inputs = tokenizer(
        batch,
        padding=True,
        truncation=True,
        return_tensors="pt",
    )
    return {key: tensor for key, tensor in inputs.items()}

def aggregate_tag_embeddings(tags, model):
    embeddings = [model.wv[tag] for tag in tags \
        if tag in model.wv]
    return np.mean(embeddings, axis=0) \
        if embeddings else np.zeros(model.vector_size)

def get_tag_embeddings(df):
    tags_list = df["tags"].tolist()    
    word2vec_model = Word2Vec(sentences=tags_list, 
                              vector_size=50,
                              window=2, min_count=1)
    
    tag_embeddings = df["tags"].apply(lambda tags: aggregate_tag_embeddings(tags, word2vec_model))
    
    return pd.DataFrame(tag_embeddings.tolist(), 
                        columns=[f"tag_{i}" \
                            for i in range(len(tag_embeddings[0]))])

def get_title_embeddings(datas, prefix='title', batch_size=16):
    dataloader = DataLoader(datas, 
                            batch_size=batch_size, 
                            collate_fn=collate_fn)
    embeddings = []
    
    for batch in dataloader:
        with torch.no_grad():
            outputs = bert_model(**batch)
            batch_embeddings = outputs.last_hidden_state.mean(dim=1).numpy()
            embeddings.extend(batch_embeddings)
            
    pca = PCA(n_components=50)
    reduced_embeddings = pca.fit_transform(embeddings)
    reduced_df = pd.DataFrame(reduced_embeddings, 
                              columns=[f"{prefix}_{i}" for i in range(50)])
    
    return reduced_df[:len(datas)]

def get_prepared_df(raw_data, train=False):
    df = pd.DataFrame(raw_data)
    
    if train:
        df['storyTitle'].to_csv('story_titles.csv', index=False)
    
    tag_embeddings = get_tag_embeddings(df)

    mlb = MultiLabelBinarizer()
    skills_encoded = pd.DataFrame(
                            mlb.fit_transform(df['skills']), 
                            columns=[skill_col_name(cls) for cls in mlb.classes_], 
                            index=df.index)

    user_skills_encoded = pd.DataFrame(
                            mlb.fit_transform(df['userSkills']), 
                            columns=[skill_col_name(cls, True) for cls in mlb.classes_], 
                            index=df.index)
    
    titles = df["storyTitle"].tolist()
    
    titles_extension_diff = 50 - len(titles)
    if titles_extension_diff > 0:
        all_titles = pd.read_csv('story_titles.csv')
        extension = all_titles \
            .sample(titles_extension_diff)['storyTitle'].tolist()
        titles.extend(extension)
        
    title_embeddings = get_title_embeddings(titles)
    
    df = pd.concat([df, title_embeddings, 
                    skills_encoded, 
                    user_skills_encoded, 
                    tag_embeddings], axis=1)
    df = df.drop(['storyTitle', 'skills', 'tags', 'userSkills'], axis=1)

    return df[:len(raw_data)]

def train_and_save_model(data):
    logging.info("Model train started")

    print("Data preparation started")
    df = get_prepared_df(data, True)
            
    X = df.drop(columns=[target_var])
    y = df[target_var]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)    
    
    print("Training started")
    start_time = datetime.now()
    if not is_rf:
        early_stop = xgb.callback.EarlyStopping(rounds=20, metric_name='error')
        
        params = {
            'objective': 'binary:logistic',
            'eval_metric': 'error',
            'callbacks': [early_stop],
            'n_estimators': n_estimators
        }
        
        model = xgb.XGBClassifier(**params)
        
        model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=True
        )
    else:
        params = {
            'n_estimators': n_estimators,      
            'max_depth': None,        
            'random_state': 42,       
            'class_weight': 'balanced'
        }
        
        model = RandomForestClassifier(**params)
        model.fit(X_train, y_train)
        
    y_pred = model.predict(X_test)

    print("=== Training Results ===")
    print(f"Training Accuracy: {model.score(X_train, y_train):.2f}")
    print(f"Validation Accuracy: {accuracy_score(y_test, y_pred):.2f}")
    
    print("\n=== Classification Report ===")
    print(classification_report(y_test, y_pred))
    
    print("\n=== Confusion Matrix ===")
    print(confusion_matrix(y_test, y_pred))
    
    end_time = datetime.now()
    
    elapsed_time = end_time - start_time
    print(f"Elapsed time:", elapsed_time)
    
    joblib.dump(model, model_file_name)

def is_model_exists():
    return Path(model_file_name).exists()

def load_model():        
    return joblib.load(model_file_name)
    
def get_predictions_xgboost(model, data):
    df = get_prepared_df(data)
    
    feature_names = model.get_booster().feature_names
    
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_names]
    
    probas = model.predict_proba(df)

    return probas[:, 1]
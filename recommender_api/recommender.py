import numpy as np
import lightgbm as lgb
import pandas as pd
import logging
import hashlib
import torch
import joblib

from sklearn.metrics import roc_auc_score, log_loss
from pathlib import Path
from transformers import BertTokenizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.decomposition import PCA
from gensim.models import Word2Vec
from transformers import BertTokenizer, BertModel
from torch.utils.data import DataLoader

target_var = 'completed'
    
logging.basicConfig(
    filename='recommender.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertModel.from_pretrained("bert-base-uncased")
model_file_name = "recommender_model.pkl"

def aggregate_embeddings(tags, model):
    embeddings = [model.wv[tag] for tag in tags if tag in model.wv]
    return np.mean(embeddings, axis=0) if embeddings else np.zeros(model.vector_size)

def skill_col_name(col_name, is_user=False):
    prefix = "user_" if is_user else ""
    return f"{prefix}skill_{hashlib.md5(col_name.encode()).hexdigest()[:8]}"

def get_title_embeddings(df, batch_size=16):
    titles = df["storyTitle"].tolist()
    
    titles_len = len(titles)
    extension_diff = 50 - titles_len
    if extension_diff > 0:
        all_titles = pd.read_csv('story_titles.csv')
        extension = all_titles.sample(extension_diff)['storyTitle'].tolist()
        titles.extend(extension)
    
    dataloader = DataLoader(titles, batch_size=batch_size)
    embeddings = []
    
    for batch in dataloader:
        inputs = tokenizer(list(batch), return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            outputs = model(**inputs)
            batch_embeddings = outputs.last_hidden_state.mean(dim=1).numpy()
            embeddings.extend(batch_embeddings)
            
    pca = PCA(n_components=50)
    reduced_embeddings = pca.fit_transform(embeddings)
    reduced_df = pd.DataFrame(reduced_embeddings, columns=[f"title_emb{i}" for i in range(50)])
    
    return reduced_df[:titles_len]

def get_prepared_df(raw_data, train=False):
    df = pd.DataFrame(raw_data)
    
    if train:
        df['storyTitle'].to_csv('story_titles.csv', index=False);
    
    tags_list = df["tags"].tolist()    
    word2vec_model = Word2Vec(sentences=tags_list, vector_size=50, window=2, min_count=1)
    
    df["tag_embeddings"] = df["tags"].apply(lambda tags: aggregate_embeddings(tags, word2vec_model))
    tag_embeddings = pd.DataFrame(df["tag_embeddings"].tolist(), 
                                columns=[f"tag_dim_{i}" for i in range(len(df["tag_embeddings"][0]))])
    
    mlb = MultiLabelBinarizer()
    skills_encoded = pd.DataFrame(mlb.fit_transform(df['skills']), 
                            columns=[skill_col_name(cls) for cls in mlb.classes_], 
                            index=df.index)

    user_skills_encoded = pd.DataFrame(mlb.fit_transform(df['userSkills']), 
                            columns=[skill_col_name(cls, True) for cls in mlb.classes_], 
                            index=df.index)
    
    title_embeddings = get_title_embeddings(df)
    
    df = pd.concat([df, title_embeddings, skills_encoded, user_skills_encoded, tag_embeddings], axis=1)
    df = df.drop(['storyTitle', 'tag_embeddings', 'skills', 'tags', 'userSkills'], axis=1)

    return df

def train_and_save_model(data):
    logging.info("Model train started")

    df = get_prepared_df(data, True)
            
    X = df.drop(columns=[target_var])
    y = df[target_var]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)    
    
    model = lgb.LGBMClassifier(
        objective="binary",
        boosting_type="gbdt",
        learning_rate=0.1,
        n_estimators=100,   
        max_depth=6,   
        num_leaves=31, 
        random_state=42
    )
    
    model.fit(
        X_train, y_train,
        eval_metric="logloss",
        eval_set=[(X_test, y_test)],
        callbacks=[
            lgb.early_stopping(20, verbose=True)
        ]
    )
    
    joblib.dump(model, model_file_name)

def is_model_exists():
    return Path(model_file_name).exists()

def load_model():        
    return joblib.load(model_file_name)
    
def get_predictions(model, data):
    df = get_prepared_df(data)
    
    feature_names = model.feature_name_
    
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_names]

    probas = model.predict_proba(df)

    return probas[:, 1]
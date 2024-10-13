import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Story } from '../_models/story.model';
import { StoryCommit } from '../_models/story-commit.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService extends BaseService {

  getStory(storyId: string) {
    return this.http.get<Story>(this.apiUrl + 'story/' + storyId);
  }

  deleteStory(storyId: string) {
    return this.http.delete(this.apiUrl + 'story/delete/' + storyId, {responseType: 'text'});
  }

  updateStory(story: Story) {
    return this.http.patch(this.apiUrl + 'story/update', story);
  }

  addCommit(storyId: string, storyCommit: StoryCommit) {
    return this.http.patch(this.apiUrl + 'story/add-commit/' + storyId, storyCommit);
  }

  removeCommit(commitId: string) {
    return this.http.delete(this.apiUrl + 'story/remove-commit/' + commitId);
  }

  updateCommit(storyCommit: StoryCommit) {
    return this.http.patch(this.apiUrl + 'story/update-commit', storyCommit);
  }
}

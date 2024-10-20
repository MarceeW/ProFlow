import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Story } from '../_models/story.model';
import { StoryCommit } from '../_models/story-commit.model';
import { HttpParams } from '@angular/common/http';

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
    return this.http.patch(this.apiUrl + 'story/update', story, {responseType: 'text'});
  }

  getCommits(storyId: string) {
    return this.http.get<StoryCommit[]>(this.apiUrl + 'story/commits/' + storyId);
  }

  addCommit(storyId: string, storyCommit: StoryCommit) {
    return this.http.patch(this.apiUrl + 'story/add-commit/' + storyId, storyCommit, {
      responseType: 'text'
    });
  }

  removeCommit(commitId: string) {
    return this.http.delete(this.apiUrl + 'story/remove-commit/' + commitId, {
      responseType: 'text'
    });
  }

  updateCommit(storyCommit: StoryCommit) {
    return this.http.patch(this.apiUrl + 'story/update-commit', storyCommit);
  }

  assign(storyId: string, userId: string) {
    return this.http.get(this.apiUrl + 'story/assign/' + storyId, {
      params: new HttpParams().set('userId', userId),
      responseType: 'text'
    });
  }

  unassign(storyId: string, userId: string) {
    return this.http.get(this.apiUrl + 'story/unassign/' + storyId, {
      params: new HttpParams().set('userId', userId),
      responseType: 'text'
    });
  }
}

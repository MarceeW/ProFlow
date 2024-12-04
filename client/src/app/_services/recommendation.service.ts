import { Injectable, signal } from '@angular/core';
import { BaseService } from './base.service';
import { map, takeUntil } from 'rxjs';
import { Story } from '../_models/story.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService extends BaseService {
  readonly recommendationCache = signal<Map<string, number>>(new Map());

  fetchRecommendations(stories: Story[]): void {
    const filteredIds = stories
      .filter(story => story.id && !this.recommendationCache().has(story.id))
      .map(story => story.id);

    if (!filteredIds)
      return;

    this.http.post<{
      storyId: string,
      probability: number
    }[]>(this.apiUrl + 'storyrecommendation', filteredIds)
      .pipe(takeUntil(this._destroy$))
      .subscribe(probs => {
        this.recommendationCache.update(cache => {
          probs.forEach(prob => {
            cache.set(prob.storyId, prob.probability);
          });
          return new Map(cache);
        });
        console.log(this.recommendationCache());
      });
  }
}

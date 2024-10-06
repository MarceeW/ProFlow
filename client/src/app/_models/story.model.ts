import { StoryCommit } from "./story-commit.model";
import { User } from "./user";

export interface Story {
  id?: string,
  created?: Date,
  title: string,
  description: string,
  assignedTo?: User,
  storyPriority: string,
  storyType: string,
  storyPoints: number,
  storyCommits?: StoryCommit[]
}

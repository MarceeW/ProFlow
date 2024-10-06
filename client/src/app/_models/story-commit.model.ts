import { User } from "./user";

export interface StoryCommit {
  id?: string,
  created?: Date,
  commiter: User,
  storyCommitType: string,
  hours: number
}

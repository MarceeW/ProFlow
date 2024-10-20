import { StoryStatus } from "../_enums/story-status.enum";
import { StoryCommit } from "./story-commit.model";
import { User } from "./user";

export interface Story {
  id?: string,
  created?: Date,
  closed?: Date,
  sprintId?: string,
  title: string,
  description: string,
  assignedTo?: User,
  storyPriority: string,
  storyType: string,
  storyPoints?: number,
  storyStatus: StoryStatus
}

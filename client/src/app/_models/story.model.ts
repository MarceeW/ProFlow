import { StoryStatus } from "../_enums/story-status.enum";
import { User } from "./user.model";

export interface Story {
  id?: string,
  created?: Date,
  closed?: Date,
  sprintId?: string,
  title: string,
  description: string,
  assignedTo?: User,
  storyPriority: string,
  tags: string[],
  storyType: string,
  storyPoints?: number,
  storyStatus: StoryStatus
}

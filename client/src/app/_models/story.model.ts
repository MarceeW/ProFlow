import { StoryStatus } from "../_enums/story-status.enum";
import { Skill } from "./skill.model";
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
  requiredSkills: Skill[],
  storyType: string,
  storyPoints?: number,
  storyStatus: StoryStatus,
  matchRate?: number
}

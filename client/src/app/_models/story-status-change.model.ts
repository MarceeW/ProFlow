import { StoryStatus } from "../_enums/story-status.enum";
import { Story } from "./story.model";
import { User } from "./user.model";

export interface StoryStatusChange {
  id: string,
  user: User,
  timestamp: Date,
  story: Story,
  previousStoryStatus: StoryStatus
  storyStatus: StoryStatus
}

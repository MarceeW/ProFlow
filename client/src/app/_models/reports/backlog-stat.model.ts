import { StoryStatus } from "../../_enums/story-status.enum";

export interface BacklogStat {
  storyStatus: StoryStatus,
  count: number
}

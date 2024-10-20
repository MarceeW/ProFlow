import { Story } from "./story.model";

export interface Sprint {
  id?: string,
  start: string,
  end: string,
  sprintBacklog?: Story[],
  isActive?: boolean
}

import { Story } from "./story.model";

export interface Sprint {
  id?: string,
  teamId: string,
  start: string,
  end: string,
  sprintBacklog?: Story[],
  isActive?: boolean,
}

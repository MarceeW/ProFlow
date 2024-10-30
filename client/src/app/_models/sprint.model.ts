import { Story } from "./story.model";

export interface Sprint {
  id?: string,
  teamId: string,
  capacity: number,
  start: string,
  end: string,
  sprintBacklog?: Story[],
  isActive?: boolean,
}

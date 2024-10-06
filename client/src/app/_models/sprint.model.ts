import { Story } from "./story.model";

export interface Sprint {
  id?: string,
  start: Date,
  end: Date,
  sprintBacklog?: Story[]
}

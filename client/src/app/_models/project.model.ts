import { Sprint } from "./sprint.model";
import { Story } from "./story.model";
import { Team } from "./team.model";
import { User } from "./user";

export interface Project {
  id?: string,
  name: string,
  projectManager: User,
  teamLeaders: User[],
  productBacklog?: Story[],
  sprints?: Sprint[]
}

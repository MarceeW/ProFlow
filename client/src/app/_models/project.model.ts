import { Sprint } from "./sprint.model";
import { User } from "./user.model";

export interface Project {
  id?: string,
  name: string,
  projectManager: User,
  teamLeaders: User[],
  sprints?: Sprint[]
}

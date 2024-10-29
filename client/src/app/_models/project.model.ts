import { Sprint } from "./sprint.model";
import { User } from "./user.model";

export interface ProjectTeam {
  id: string,
  name: string,
  teamLeaderId: string,
  memberIds: string[]
}

export interface Project {
  id?: string,
  name: string,
  projectManager: User,
  teamLeaders: User[],
  teams: ProjectTeam[],
  sprints?: Sprint[]
}

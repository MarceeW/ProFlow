import { Team } from "./team";
import { User } from "./user";

export interface Project {
  projectName: string,
  projectManager: User,
  teams: Team[]
}

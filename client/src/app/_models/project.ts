import { Team } from "./team";
import { User } from "./user";

export interface Project {
  id: string,
  name: string,
  projectManager: User,
  teams: Team[]
}

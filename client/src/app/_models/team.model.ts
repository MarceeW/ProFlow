import { Project } from "./project.model";
import { User } from "./user";

export interface Team {
  id?: string,
  name: string,
  teamLeader?: User,
  members?: User[],
  projects?: Project[]
}

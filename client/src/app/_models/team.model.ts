import { Project } from "./project.model";
import { UserSkill } from "./user-skill.model";
import { User } from "./user.model";

export interface Team {
  id?: string,
  name: string,
  teamLeader: User,
  members: User[],
  projects: Project[],
  topUserSkills: UserSkill[]
}

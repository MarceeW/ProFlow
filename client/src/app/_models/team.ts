import { User } from "./user";

export interface Team {
  teamLeader: User,
  members?: User[]
}

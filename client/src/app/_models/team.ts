import { User } from "./user";

export interface Team {
  id?: string,
  name: string,
  teamLeader?: User,
  members?: User[]
}

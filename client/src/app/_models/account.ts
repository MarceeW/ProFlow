import { Invitation } from "./invitation";

export interface Account {
  id: string,
  roles: string[],
  invitation: Invitation | null,
  userName: string,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  created: Date,
  lastSeen: Date
};

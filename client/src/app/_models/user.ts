import { Invitation } from "./invitation";

export interface User {
  roles: string[],
  invitation: Invitation | null,
  userName: string,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  created: Date,
  lastSeen: Date
};

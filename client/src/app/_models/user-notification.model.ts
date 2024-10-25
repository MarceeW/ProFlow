import { User } from "./user.model";

export interface UserNotification {
  type: string,
  title: string,
  content: string,
  targetUser: User,
  created: Date,
  viewed: boolean
}

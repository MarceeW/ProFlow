import { RoleType } from "../_enums/role-type.enum";

export interface AuthUser {
  id: string,
  userName: string,
  fullName: string,
  token: string,
  roles: (string | RoleType)[],
}

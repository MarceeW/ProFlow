import { RoleType } from "../_enums/role-type.enum";

export interface AuthUser {
  id: string,
  userName: string;
  token: string;
  roles: (string | RoleType)[];
}

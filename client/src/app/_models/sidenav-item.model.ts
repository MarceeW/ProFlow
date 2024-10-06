export interface SidenavItem {
  label: string,
  routerLink: string,
  activated?: boolean,
  icon?: string,
  children?: SidenavItem[]
}

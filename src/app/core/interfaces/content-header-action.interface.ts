export enum ContentHeaderActionType {
  Menu = 'menu',
}

export interface HeaderActionMenuItems {
  name: string;
  id: string;
  icon?: string;
}
export interface ContentHeaderAction {
  id: string;
  icon: string;
  label: string;
  type?: ContentHeaderActionType;
  items?: HeaderActionMenuItems[];
}

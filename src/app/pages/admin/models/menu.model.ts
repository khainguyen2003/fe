export interface MenuItem {
  id: number;
  name: string;
  icon: string;
  link?: string;
  subMenus?: MenuItem[];
  hidden?: boolean;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Branch {
  id: number;
  name: string;
}
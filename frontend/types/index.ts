import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}


export type Product = {
  _id: number;
  name: string;
  description: string;
  created_at: string;
  price: number;
  category: string;
  updated_at: string;
};


export interface WeekInfo {
  _id: string;
  state: string;
  year: number;
  yearStr?: string;
  weekNumber: string;
  isDeleted: number;

  displayName: string;
}

export interface HorseInfo {
  _id: string;
  horseNumber: string;
  originImageS3Link: string;
  thumbWebS3Link: string;
  thumbnailS3Link: string;
  week: string;
  aspectRatio: number;
  isDeleted: number;
}

export interface CartItem {
  horseImageId: string;
  productId: string;
  quantity: number;
}


export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

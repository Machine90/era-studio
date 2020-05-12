
export type MenuType = "studio" | "logic-layer" | "settings" | "back";
export type MenuIcon = "dropbox" | "settings" | "object group" | "sign-out";

export interface LeftMenu {
    key: MenuType;
    title: string;
    content?: any;
    icon: MenuIcon;
}

import * as React from "react";

export interface Props {
    styles: object;
    strategy?: object;
    input?: object;
}

export interface States {
}

// ============================================
// =              Types define
// ============================================

export type Category = "game" | "ui" | "marketing";
export type ComponentType = "scene" | "sprite";

// ============================================
// =              Strucutre define
// ============================================

export class Rect {
    posX?: number;
    posY?: number;
    width?: string;
    height?: string;
    draggable?: boolean = true;
    resizable?: boolean = false;
}

export class Author {
    id?: string;
    name: string;
    organization?: string;
    desc: string;
}

export class Draggable {
    public horizontal?: boolean = true;
    public vertical?: boolean = true;
}

export class Describe {
    app: string;
    name: string;
    author?: Author;
    alias?: string;
    description?: string;
    version?: number = 1;
    thumbnail?: string;
    category: Category;
    tag: string;
    isScene?: boolean;
    // styles
    styleFragments?: StyleFragments[];
    rect: Rect;
    draggable?: Draggable;
}

export abstract class AsuraScene extends React.Component<Props, States> {
}

export abstract class AsuraSprite extends React.Component<Props, States> {
}

interface StylesProps {
    updateStyles: (styles: object) => void;
    styles: object;
}

export abstract class StylesEditor extends React.Component<StylesProps, any> {
}

interface StrategyProps {
    updateStrategy: (strategy: object) => void;
    strategy?: object;
}

export abstract class StrategyEditor extends React.Component<StrategyProps, any> {
}

// ========================================
// =                installing
// ========================================
export interface Addon {
    describe: Describe;
    component: Function;
    styleEditor?: any;
    strategyEditor?: any;
    type: ComponentType;
}

export interface Asura {
    mountAddon: (addon: Addon) => string;
}

// Fragments
export declare type StyleFragments = "font" | "color" | "drag";
export interface Font {
    size: string;
    verticalAlign: "center" | "left" | "right";
    horizontalAlign: "center" | "left" | "right";
}

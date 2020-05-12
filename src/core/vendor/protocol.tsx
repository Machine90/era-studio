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
    public posX?: number;
    public posY?: number;
    public width?: string;
    public height?: string;
    public draggable?: boolean = true;
    public resizable?: boolean = false;
}

export class Author {
    public id?: string;
    public name: string;
    public organization?: string;
    public desc: string;
}

export class Describe {
    public app: string;
    public name: string;
    public author?: Author;
    public alias?: string;
    public description?: string;
    public version?: number = 1;
    public thumbnail?: string;
    public category: Category;
    public tag: string;
    public rect: Rect;
    public isScene?: boolean;
    public styleFragments?: StyleFragments[];
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
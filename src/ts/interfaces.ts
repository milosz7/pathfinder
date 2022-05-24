export interface cell {
  posX: number;
  posY: number;
  wrapper: HTMLElement;
  activeAdjacent: number;
}

export type cellCoordinates = [number, number];
export type coordinateArr = Array<cellCoordinates>;

export interface stageBase {
  elementsInRow: number;
  coordinateLimitDefault: number;
  elementsAmount: number;
  cells: Array<cell>;
  route: coordinateArr;
}

export interface appProps {
  [key: string]: Function
}

export interface initPages {
  navWrapper: HTMLElement;
  navLinks: NodeListOf<HTMLAnchorElement>;
  pages: HTMLCollection;
}

export interface activatePage {
  pages: HTMLCollection;
  navLinks: NodeListOf<HTMLAnchorElement>;
}

export interface initPathfinder {
  wrapper: HTMLDivElement;
  pathfinder: object;
}

export interface initReset {
  wrapper: HTMLDivElement;
  pathfinder: object;
  sideMenuButton: HTMLDivElement;
  sideMenuControls: HTMLDivElement;
  sideMenuTitle: HTMLElement;
}

export interface initButtons {
  rulesButton: HTMLButtonElement;
  rulesHideButtons: NodeListOf<HTMLButtonElement>;
  sideMenuButton: HTMLDivElement;
  sideMenuControls: HTMLDivElement;
  sideMenuTitle: HTMLElement;
}
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
import { select, settings, classNames, textMessages } from '../settings.js';
import { cell, stageBase, cellCoordinates, coordinateArr } from '../interfaces'
import helpers from '../helpers.js';
import PathfinderCell from './PathfinderCell.js';
import PathfinderSecondStage from './PathfinderSecondStage.js';



interface classProps extends stageBase {
  testPath: coordinateArr;
  elementsInRow: number;
  handlerWithInitCells: Function;
  dom: { [key: string]: HTMLElement };
}

interface Pathfinder extends classProps {}

class Pathfinder {
  constructor(wrapper: HTMLElement) {
    this.cells = [];
    this.route = [];
    this.dom = {};
    this.getElements(wrapper);
    this.decideCellsAmount();
    this.createElements();
    this.initActions();
  }

  decideCellsAmount() {
    if (helpers.isMobile()) {
      this.elementsInRow = settings.pathfinderMobile.elementsInRow;
      this.coordinateLimitDefault = settings.pathfinderMobile.coordinateLimitDefault;
      this.elementsAmount = settings.pathfinderMobile.elementsAmountDefault;
    } else {
      this.elementsInRow = settings.pathfinder.elementsInRow;
      this.coordinateLimitDefault = settings.pathfinder.coordinateLimitDefault;
      this.elementsAmount = settings.pathfinder.elementsAmountDefault;
    }
  }

  createElements() {
    let posX = 0;
    let posY = 0;
    for (let i = 0; i < this.elementsAmount; i++) {
      const gridElement = document.createElement('div');
      gridElement.style.flexBasis = `${100 / this.elementsInRow}%`;
      const cell = new PathfinderCell(gridElement, posX, posY);
      this.cells.push(cell);
      if (posX % this.coordinateLimitDefault === 0 && posX !== 0) {
        posY++;
        posX = 0;
      } else {
        posX++;
      }
      this.dom.wrapper.appendChild(gridElement);
    }
  }

  selectPath(cell: cell) {
    const clickedCoordinates: cellCoordinates = [cell.posX, cell.posY];
    this.generateElemData(cell);
    cell.wrapper.classList.toggle(
      classNames.pathfinder.active,
      this.toggleStatus(clickedCoordinates, cell)
    );
    this.markClickable();
  }

  toggleStatus(coordinates: cellCoordinates, cell: cell) {
    const path = this.route;
    const posX = cell.posX;
    const posY = cell.posY;
    if (!cell.wrapper.classList.contains(classNames.pathfinder.active)) {
      if (path.length === 0) {
        path.push(coordinates);
        return true;
      }
      if (cell.activeAdjacent === 0) {
        helpers.displayMessage(textMessages.errors.notAdjacent);
        return false;
      } else if (cell.activeAdjacent > 0) {
        path.push(coordinates);
        return true;
      }
    } else {
      this.testPath = [];
      const routeID = settings.pathfinder.routeID;
      const testPathID = settings.pathfinder.testPathID;
      const notIncluded = !this.testIndex(coordinates[0], coordinates[1], testPathID);
      const cellToUnstageIdx = this.getIndex(posX, posY, routeID);
      if (typeof cellToUnstageIdx === 'number') {
        path.splice(cellToUnstageIdx, 1);
      }
      for (let coordinates of path) {
        if (this.testPath.length === 0) {
          this.testPath.push(coordinates);
        } else if (
          (notIncluded && this.testIndex(coordinates[0] + 1, coordinates[1], testPathID)) ||
          (notIncluded && this.testIndex(coordinates[0] - 1, coordinates[1], testPathID)) ||
          (notIncluded && this.testIndex(coordinates[0], coordinates[1] + 1, testPathID)) ||
          (notIncluded && this.testIndex(coordinates[0], coordinates[1] - 1, testPathID))
        ) {
          this.testPath.push(coordinates);
        }
        for (let coordinates of this.testPath) {
          if (
            this.testIndex(coordinates[0] + 1, coordinates[1], routeID) &&
            !this.testIndex(coordinates[0] + 1, coordinates[1], testPathID)
          ) {
            this.testPath.push([coordinates[0] + 1, coordinates[1]]);
          }
          if (
            this.testIndex(coordinates[0] - 1, coordinates[1], routeID) &&
            !this.testIndex(coordinates[0] - 1, coordinates[1], testPathID)
          ) {
            this.testPath.push([coordinates[0] - 1, coordinates[1]]);
          }
          if (
            this.testIndex(coordinates[0], coordinates[1] + 1, routeID) &&
            !this.testIndex(coordinates[0], coordinates[1] + 1, testPathID)
          ) {
            this.testPath.push([coordinates[0], coordinates[1] + 1]);
          }
          if (
            this.testIndex(coordinates[0], coordinates[1] - 1, routeID) &&
            !this.testIndex(coordinates[0], coordinates[1] - 1, testPathID)
          ) {
            this.testPath.push([coordinates[0], coordinates[1] - 1]);
          }
        }
        if (this.testPath.length === path.length) {
          return false;
        } else {
          path.push([posX, posY]);
          helpers.displayMessage(textMessages.errors.breakPath);
          return true;
        }
      }
    }
  }

  markClickable() {
    for (let cell of this.cells) {
      this.generateElemData(cell);
      if (cell.activeAdjacent > 0) {
        cell.wrapper.classList.toggle(
          classNames.pathfinder.clickable,
          !cell.wrapper.classList.contains(classNames.pathfinder.active)
        );
      } else if (cell.activeAdjacent === 0) {
        cell.wrapper.classList.remove(classNames.pathfinder.clickable);
      }
    }
  }

  
  getIndex(posX: number, posY: number, pathArr: keyof Pathfinder) {
    const path = this[pathArr] as coordinateArr;
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return path.indexOf(routeCoordinates);
      }
    }
  }

  testIndex(posX: number, posY: number, pathArr: keyof Pathfinder) {
    const path = this[pathArr] as coordinateArr;
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return true;
      }
    }
    return false;
  }

  generateElemData(cell: cell) {
    cell.activeAdjacent = 0;
    const adjacencySelectors: {[key: string]: string} = {
      top: `[pos-x="${cell.posX}"][pos-y="${cell.posY - 1}"]`,
      left: `[pos-x="${cell.posX - 1}"][pos-y="${cell.posY}"]`,
      bottom: `[pos-x="${cell.posX}"][pos-y="${cell.posY + 1}"]`,
      right: `[pos-x="${cell.posX + 1}"][pos-y="${cell.posY}"]`,
    };
    for (let selector in adjacencySelectors) {
      const selectedElement = this.dom.wrapper.querySelector(adjacencySelectors[selector]);
      if (
        selectedElement &&
        selectedElement.classList.contains(classNames.pathfinder.active)
      ) {
        cell.activeAdjacent++;
      }
    }
  }

  selectCell(element: HTMLElement) {
    const posX = parseInt(element.getAttribute('pos-x')!, 10);
    const posY = parseInt(element.getAttribute('pos-y')!, 10);
    return this.cells[posY * this.elementsInRow + posX];
  }

  handler = (initCells: Function) => {
    if (this.route.length >= settings.pathfinder.minPathLength) {
      this.finishDrawing(initCells);
      this.dom.controlsButton.removeEventListener(
        'click',
        this.handlerWithInitCells as EventListener
      );
    } else {
      helpers.displayMessage(textMessages.errors.pathTooShort);
    }
  };

  initActions() {
    const initCells = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(select.pathfinder.element)) {
        const clickedCell = this.selectCell(target.closest(select.pathfinder.element)!);
        this.selectPath(clickedCell);
      }
    };
    this.handlerWithInitCells = () => {
      this.handler(initCells);
    };
    this.dom.wrapper.addEventListener('click', initCells);
    this.dom.controlsButton.addEventListener('click', this.handlerWithInitCells as EventListener);
  }

  getElements(wrapper: HTMLElement) {
    this.dom.wrapper = wrapper;
    this.dom.container = document.querySelector(select.containerOf.finder)!;
    this.dom.controlsButton = document.querySelector(select.pathfinder.controlsButton)!;
    this.dom.titleMessage = document.querySelector(select.pathfinder.messageTitle)!;
  }

  finishDrawing(functionToRemove: Function) {
    const pathfinderData = {
      route: this.route,
      cells: this.cells,
      elementsInRow: this.elementsInRow,
      coordinateLimitDefault: this.coordinateLimitDefault,
      elementsAmount: this.elementsAmount,
      wrapper: this.dom.wrapper,
      dom: this.dom,
    };
    for (let cell of this.cells) {
      this.generateElemData(cell);
      if (cell.wrapper.classList.contains(classNames.pathfinder.clickable)) {
        cell.wrapper.classList.remove(classNames.pathfinder.clickable);
      }
    }
    this.dom.controlsButton.innerHTML = textMessages.pathfinder.pickCells.btnText;
    this.dom.titleMessage.innerHTML = textMessages.pathfinder.pickCells.title;
    this.dom.wrapper.removeEventListener('click', functionToRemove as EventListener);
    new PathfinderSecondStage(pathfinderData);
  }
}

export default Pathfinder;

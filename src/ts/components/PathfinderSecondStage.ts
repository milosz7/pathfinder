import helpers from '../helpers.js';
import { select, settings, classNames, textMessages } from '../settings.js';
import { cell, stageBase, coordinateArr } from '../interfaces'
import PathfinderThirdStage from './PathfinderThirdStage.js';

interface classProps extends stageBase {
  selectedPoints: coordinateArr;
  dom: { [key: string]: HTMLElement };
  handlerWithInitPoints: Function;
  keyof: string;
}

interface PathfinderSecondStage extends classProps {}

class PathfinderSecondStage {
  // pathArr: string;
  constructor(data: stageBase) {
    this.dom = {};
    this.route = data.route;
    this.cells = data.cells;
    this.elementsInRow = data.elementsInRow;
    this.coordinateLimitDefault = data.coordinateLimitDefault;
    this.elementsAmount = data.elementsAmount;
    this.getElements();
    this.animateGrid();
    this.initActions();
  }

  animateGrid() {
    this.dom.wrapper.classList.add(classNames.pathfinder.update);
    setTimeout(() => {
      this.dom.wrapper.classList.remove(classNames.pathfinder.update);
    },settings.pathfinder.gridReloadTime);
  }

  getElements() {
    this.dom.wrapper = document.querySelector(select.containerOf.pathfinder)!;
    this.dom.controlsButton = document.querySelector(select.pathfinder.controlsButton)!;
    this.dom.titleMessage = document.querySelector(select.pathfinder.messageTitle)!;
  }

  getIndex(posX: number, posY: number, pathArr: keyof PathfinderSecondStage) {
    const path = this[pathArr] as coordinateArr
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return path.indexOf(routeCoordinates);
      }
    }
  }

  testIndex(posX: number, posY: number, pathArr: keyof PathfinderSecondStage) {
    const path = this[pathArr] as coordinateArr;
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return true;
      }
    }
    return false;
  }

  selectCell(element: HTMLElement) {
    const posX = parseInt(element.getAttribute('pos-x')!, 10);
    const posY = parseInt(element.getAttribute('pos-y')!, 10);
    return this.cells[posY * this.elementsInRow + posX];
  }

  handler = (initPoints: Function) => {
    if (this.selectedPoints.length === 2) {
      this.confirmPoints(initPoints);
      this.dom.controlsButton.removeEventListener('click', this.handlerWithInitPoints as EventListener);
    } else if (this.selectedPoints.length !== 2) {
      helpers.displayMessage(textMessages.errors.choosePoints);
    }
  };

  initActions() {
    this.selectedPoints = [];
    const initPoints = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest(select.pathfinder.elementActive)) {
        const clickedCell = this.selectCell(target.closest(select.pathfinder.elementActive)!);
        this.selectPoint(clickedCell);
      } else if (target.closest(select.pathfinder.element)) {
        helpers.displayMessage(textMessages.errors.notInRoute);
      }
    };
    this.handlerWithInitPoints = () => {
      this.handler(initPoints);
    };
    this.dom.wrapper.addEventListener('dblclick', initPoints);
    this.dom.controlsButton.addEventListener('click', this.handlerWithInitPoints as EventListener);
  }

  selectPoint(cell: cell) {
    const posX = cell.posX;
    const posY = cell.posY;
    if (
      this.selectedPoints.length < settings.pathfinder.maxPointNumber &&
      !this.testIndex(posX, posY, settings.pathfinder.selectedPoints)
    ) {
      this.selectedPoints.push([posX, posY]);
      cell.wrapper.classList.toggle(classNames.pathfinder.startEnd);
    } else if (this.testIndex(posX, posY, settings.pathfinder.selectedPoints)) {
      const idxToRemove = this.getIndex(posX, posY, settings.pathfinder.selectedPoints)
      if (typeof idxToRemove === 'number') {
        this.selectedPoints.splice(idxToRemove, 1);
      }
      cell.wrapper.classList.toggle(classNames.pathfinder.startEnd);
    } else {
      helpers.displayMessage(textMessages.errors.tooManyPoints);
    }
    
  }

  confirmPoints(functionToRemove: Function) {
    const routeData = {
      selectedPoints: this.selectedPoints,
      route: this.route,
      cells: this.cells,
      elementsInRow: this.elementsInRow,
      coordinateLimitDefault: this.coordinateLimitDefault,
      elementsAmount: this.elementsAmount,
    };
    this.dom.controlsButton.innerHTML = textMessages.pathfinder.result.btnText;
    this.dom.titleMessage.innerHTML = textMessages.pathfinder.result.title;
    this.dom.wrapper.removeEventListener('dblclick', functionToRemove as EventListener);
    new PathfinderThirdStage(routeData);
  }
}

export default PathfinderSecondStage;
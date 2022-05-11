import helpers from '../helpers.js';
import { select, settings, classNames, textMessages } from '../settings.js';
import PathfinderThirdStage from './PathfinderThirdStage.js';

class PathfinderSecondStage {
  constructor(data) {
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
    this.wrapper.classList.add(classNames.pathfinder.update);
    setTimeout(() => {
      this.wrapper.classList.remove(classNames.pathfinder.update);
    },settings.pathfinder.gridReloadTime);
  }

  getElements() {
    this.wrapper = document.querySelector(select.containerOf.pathfinder);
    this.controlsButton = document.querySelector(select.pathfinder.controlsButton);
    this.titleMessage = document.querySelector(select.pathfinder.messageTitle);
  }

  getIndex(posX, posY, pathArr) {
    const path = this[pathArr];
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return path.indexOf(routeCoordinates);
      }
    }
  }

  testIndex(posX, posY, pathArr) {
    const path = this[pathArr];
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return true;
      }
    }
    return false;
  }

  selectCell(element) {
    const posX = parseInt(element.getAttribute('pos-x'), 10);
    const posY = parseInt(element.getAttribute('pos-y'), 10);
    return this.cells[posY * this.elementsInRow + posX];
  }

  handler = (initPoints) => {
    if (this.selectedPoints.length === 2) {
      this.confirmPoints(initPoints);
      this.controlsButton.removeEventListener('click', this.handlerWithInitPoints);
    } else if (this.selectedPoints.length !== 2) {
      helpers.displayMessage(textMessages.errors.choosePoints);
    }
  };

  initActions() {
    this.selectedPoints = [];
    const initPoints = (e) => {
      if (e.target.closest(select.pathfinder.elementActive)) {
        const clickedCell = this.selectCell(e.target.closest(select.pathfinder.elementActive));
        this.selectPoint(clickedCell);
      } else if (e.target.closest(select.pathfinder.element)) {
        helpers.displayMessage(textMessages.errors.notInRoute);
      }
    };
    this.handlerWithInitPoints = () => {
      console.log('test2');
      this.handler(initPoints);
    };
    this.wrapper.addEventListener('dblclick', initPoints);
    this.controlsButton.addEventListener('click', this.handlerWithInitPoints);
  }

  selectPoint(cell) {
    const posX = cell.posX;
    const posY = cell.posY;
    if (
      this.selectedPoints.length < settings.pathfinder.maxPointNumber &&
      !this.testIndex(posX, posY, settings.pathfinder.selectedPoints)
    ) {
      this.selectedPoints.push([posX, posY]);
      cell.wrapper.classList.toggle(classNames.pathfinder.startEnd);
    } else if (this.testIndex(posX, posY, settings.pathfinder.selectedPoints)) {
      this.selectedPoints.splice(
        this.getIndex(posX, posY, settings.pathfinder.selectedPoints),
        1
      );
      cell.wrapper.classList.toggle(classNames.pathfinder.startEnd);
    } else {
      helpers.displayMessage(textMessages.errors.tooManyPoints);
    }
    
  }

  confirmPoints(functionToRemove) {
    const routeData = {
      selectedPoints: this.selectedPoints,
      route: this.route,
      cells: this.cells,
      elementsInRow: this.elementsInRow,
      coordinateLimitDefault: this.coordinateLimitDefault,
      elementsAmount: this.elementsAmount,
    };
    this.controlsButton.innerHTML = textMessages.pathfinder.result.btnText;
    this.titleMessage.innerHTML = textMessages.pathfinder.result.title;
    this.wrapper.removeEventListener('dblclick', functionToRemove);
    new PathfinderThirdStage(routeData);
  }
}

export default PathfinderSecondStage;
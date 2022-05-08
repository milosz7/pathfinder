import helpers from '../helpers.js';
import { select, settings, classNames, textMessages } from '../settings.js';
import PathfinderThirdStage from './PathfinderThirdStage.js';

class PathfinderSecondStage {
  constructor(data) {
    this.route = data.route;
    this.cells = data.cells;
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
    for (let cell of this.cells) {
      if (cell.posX === posX && cell.posY === posY) {
        return cell;
      }
    }
  }

  initActions() {
    const thisPathfinder = this;
    this.selectedPoints = [];
    const initPoints = function (e) {
      if (e.target.closest(select.pathfinder.elementActive)) {
        const clickedCell = thisPathfinder.selectCell(e.target.closest(select.pathfinder.elementActive));
        thisPathfinder.selectPoint(clickedCell);
      } else if (e.target.closest(select.pathfinder.element)) {
        helpers.displayMessage(textMessages.errors.notInRoute);
      }
    };
    this.wrapper.addEventListener('dblclick', initPoints);
    this.controlsButton.addEventListener('click', function handler() {
      if (thisPathfinder.selectedPoints.length === 2) {
        thisPathfinder.animateGrid();
        thisPathfinder.confirmPoints(initPoints);
        this.removeEventListener('click', handler);
      } else if (thisPathfinder.selectedPoints.length !== 2) {
        helpers.displayMessage(textMessages.errors.choosePoints);
      }
      
    });
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
    };
    this.controlsButton.innerHTML = textMessages.pathfinder.result.btnText;
    this.titleMessage.innerHTML = textMessages.pathfinder.result.title;
    this.wrapper.removeEventListener('dblclick', functionToRemove);
    new PathfinderThirdStage(routeData);
  }
}

export default PathfinderSecondStage;
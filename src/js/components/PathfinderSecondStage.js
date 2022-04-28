import helpers from '../helpers.js';
import { select, settings, classNames, textMessages } from '../settings.js';
import PathfinderThirdStage from './PathfinderThirdStage.js';

class PathfinderSecondStage {
  constructor(data) {
    this.wrapper = data.wrapper;
    this.controlsButton = data.controlsButton;
    this.route = data.route;
    this.titleMessage = data.titleMessage;
    this.cells = data.cells;
    this.initActions();
  }

  getIndex(posX, posY, pathArr) {
    const path = this[pathArr];
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return path.indexOf(routeCoordinates);
      }
    }
    // return settings.noIndexValue;
  }

  testIndex(posX, posY, pathArr) {//scalić
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
        console.log(cell);
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
      }
    };
    this.wrapper.addEventListener('dblclick', initPoints);
    this.controlsButton.addEventListener('click', function handler() {
      if (thisPathfinder.selectedPoints.length === 2) {
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
    };
    this.controlsButton.innerHTML = textMessages.pathfinder.result.btnText;
    this.titleMessage.innerHTML = textMessages.pathfinder.result.title;
    this.wrapper.removeEventListener('dblclick', functionToRemove);
    new PathfinderThirdStage(routeData);
  }
}

export default PathfinderSecondStage;
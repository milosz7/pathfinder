import { select, settings, classNames, textMessages } from '../settings.js';
import helpers from '../helpers.js';
import PathfinderCell from './PathfinderCell.js';
import PathfinderSecondStage from './PathfinderSecondStage.js';

class Pathfinder {
  constructor(wrapper) {
    const thisPathfinder = this;
    thisPathfinder.wrapper = wrapper;
    thisPathfinder.cells = [];
    thisPathfinder.route = [];
    thisPathfinder.decideCellsAmount();
    thisPathfinder.createElements();
    thisPathfinder.getElements();
    thisPathfinder.initActions();
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
      this.wrapper.appendChild(gridElement);
    }
  }

  selectPath(cell) {
    const clickedCoordinates = [];
    this.generateElemData(cell, cell.posX, cell.posY);
    clickedCoordinates.push(cell.posX, cell.posY);
    cell.wrapper.classList.toggle(
      classNames.pathfinder.active,
      this.toggleStatus(clickedCoordinates, cell)
    );
    this.markClickable();
  }

  toggleStatus(coordinates, cell) {
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
      const testPath = (this.testPath = []);
      const routeID = settings.pathfinder.routeID;
      const testPathID = settings.pathfinder.testPathID;
      const notIncluded = !this.testIndex(coordinates[0], coordinates[1], testPathID);
      path.splice(this.getIndex(posX, posY, routeID), 1);  
      for (let coordinates of path) {
        if (testPath.length === 0) {
          testPath.push(coordinates);
        } else if (
          (notIncluded &&
            this.testIndex(coordinates[0] + 1, coordinates[1], testPathID)) ||
          (notIncluded &&
            this.testIndex(coordinates[0]  - 1, coordinates[1], testPathID)) ||
          (notIncluded &&
            this.testIndex(coordinates[0] , coordinates[1] + 1, testPathID)) ||
          (notIncluded &&
            this.testIndex(coordinates[0] , coordinates[1] - 1, testPathID))
        ) {
          testPath.push(coordinates);
        }
        for (let coordinates of testPath) {
          if (
            this.testIndex(coordinates[0] + 1, coordinates[1], routeID) &&
            !this.testIndex(coordinates[0] + 1, coordinates[1], testPathID)
          ) {
            testPath.push([coordinates[0] + 1, coordinates[1]]);
          }
          if (
            this.testIndex(coordinates[0] - 1, coordinates[1], routeID) &&
            !this.testIndex(coordinates[0] - 1, coordinates[1], testPathID)
          ) {
            testPath.push([coordinates[0] - 1, coordinates[1]]);
          }
          if (
            this.testIndex(coordinates[0], coordinates[1] + 1, routeID) &&
            !this.testIndex(coordinates[0], coordinates[1] + 1, testPathID)
          ) {
            testPath.push([coordinates[0], coordinates[1] + 1]);
          }
          if (
            this.testIndex(coordinates[0], coordinates[1] - 1, routeID) &&
            !this.testIndex(coordinates[0], coordinates[1] - 1, testPathID)
          ) {
            testPath.push([coordinates[0], coordinates[1] - 1]);
          }
        }
        if (testPath.length === path.length) {
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
      this.generateElemData(cell, cell.posX, cell.posY);
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

  generateElemData(cell, posX, posY) {
    cell.activeAdjacent = 0;
    const adjacencySelectors = {
      top: `[pos-x="${posX}"][pos-y="${posY - 1}"]`,
      left: `[pos-x="${posX - 1}"][pos-y="${posY}"]`,
      bottom: `[pos-x="${posX}"][pos-y="${posY + 1}"]`,
      right: `[pos-x="${posX + 1}"][pos-y="${posY}"]`,
    };
    for (let selector in adjacencySelectors) {
      const selectedElement = this.wrapper.querySelector(adjacencySelectors[selector]);
      if (
        selectedElement !== null &&
        selectedElement.classList.contains(classNames.pathfinder.active)
      ) {
        cell.activeAdjacent++;
      }
    }
  }

  selectCell(element) {
    const posX = parseInt(element.getAttribute('pos-x'), 10);
    const posY = parseInt(element.getAttribute('pos-y'), 10);
    return this.cells[posY * this.elementsInRow + posX];
  }

  handler = (initCells) => {
    if (this.route.length >= settings.pathfinder.minPathLength) {
      this.finishDrawing(initCells);
      this.controlsButton.removeEventListener('click', this.handlerWithInitCells);
    } else {
      helpers.displayMessage(textMessages.errors.pathTooShort);
    }
  };

  initActions() {
    const initCells = (e) => {
      if (e.target.closest(select.pathfinder.element)) {
        const clickedCell = this.selectCell(e.target.closest(select.pathfinder.element));
        this.selectPath(clickedCell);
      }
    };
    this.handlerWithInitCells = () => {
      this.handler(initCells);
      console.log('test1');
    };
    this.wrapper.addEventListener('click', initCells);
    this.controlsButton.addEventListener('click', this.handlerWithInitCells);
  }

  getElements() {
    this.container = document.querySelector(select.containerOf.finder);
    this.controlsButton = document.querySelector(select.pathfinder.controlsButton);
    this.titleMessage = document.querySelector(select.pathfinder.messageTitle);
  }

  finishDrawing(functionToRemove) {
    const pathfinderData = {
      route: this.route,
      cells: this.cells,
      elementsInRow: this.elementsInRow,
      coordinateLimitDefault: this.coordinateLimitDefault,
      elementsAmount: this.elementsAmount,
    };
    for (let cell of this.cells) {
      this.generateElemData(cell, cell.posX, cell.posY);
      if (cell.wrapper.classList.contains(classNames.pathfinder.clickable)) {
        cell.wrapper.classList.remove(classNames.pathfinder.clickable);
      }
    }
    this.controlsButton.innerHTML = textMessages.pathfinder.pickCells.btnText;
    this.titleMessage.innerHTML = textMessages.pathfinder.pickCells.title;
    this.wrapper.removeEventListener('click', functionToRemove);
    new PathfinderSecondStage(pathfinderData);
  }
}

export default Pathfinder;
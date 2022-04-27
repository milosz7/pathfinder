import { select, settings, classNames } from '../settings.js';
import PathfinderCell from './PathfinderCell.js';

class Pathfinder {
  constructor(wrapper) {
    const thisPathfinder = this;
    thisPathfinder.wrapper = wrapper;
    thisPathfinder.cells = [];
    thisPathfinder.route = [];
    thisPathfinder.createElements();
    thisPathfinder.getElements();
    thisPathfinder.initActions();
    console.log(thisPathfinder);
  }

  createElements() {
    const thisPathfinder = this;
    let posX = 0;
    let posY = 0;
    for (let i = 0; i < settings.pathfinder.elementsAmountDefault; i++) {
      const gridElement = document.createElement('div');
      const cell = new PathfinderCell(gridElement, posX, posY);
      thisPathfinder.cells.push(cell);
      // gridElement.classList.add(classNames.pathfinder.element);
      // gridElement.setAttribute('pos-x', posX);
      // gridElement.setAttribute('pos-y', posY);
      if (posX % settings.pathfinder.coordinateLimitDefault === 0 && posX !== 0) {
        posY++;
        posX = 0;
      } else {
        posX++;
      }
      thisPathfinder.wrapper.appendChild(gridElement);
    }
  }

  selectPath(cell) {
    const thisPathfinder = this;
    const clickedCoordinates = [];
    thisPathfinder.generateElemData(cell, cell.posX, cell.posY);
    clickedCoordinates.push(cell.posX, cell.posY);
    cell.wrapper.classList.toggle(
      classNames.pathfinder.active,
      thisPathfinder.toggleStatus(clickedCoordinates, cell)
    );
  }

  toggleStatus(coordinates, cell) {
    debugger;
    const thisPathfinder = this;
    const path = thisPathfinder.route;
    const posX = cell.posX;
    const posY = cell.posY;
    if (!cell.wrapper.classList.contains(classNames.pathfinder.active)) {
      if (path.length === 0) {
        path.push(coordinates);
        return true;
      }
      if (cell.activeAdjacent === 0) {
        return false;
      } else if (cell.activeAdjacent > 0) {
        path.push(coordinates);
        return true;
      }
    } else {
      const testPath = (thisPathfinder.testPath = []);
      const routeID = settings.pathfinder.routeID;
      const testPathID = settings.pathfinder.testPathID;
      const notIncluded = !thisPathfinder.testIndex(coordinates[0], coordinates[1], testPathID);
      path.splice(thisPathfinder.getIndex(posX, posY, routeID), 1);  
      for (let coordinates of path) {
        if (testPath.length === 0) {
          testPath.push(coordinates);
        } else if (
          (notIncluded &&
            thisPathfinder.testIndex(coordinates[0] + 1, coordinates[1], testPathID)) ||
          (notIncluded &&
            thisPathfinder.testIndex(coordinates[0]  - 1, coordinates[1], testPathID)) ||
          (notIncluded &&
            thisPathfinder.testIndex(coordinates[0] , coordinates[1] + 1, testPathID)) ||
          (notIncluded &&
            thisPathfinder.testIndex(coordinates[0] , coordinates[1] - 1, testPathID))
        ) {
          testPath.push(coordinates);
        }
        for (let coordinates of testPath) {
          if (
            thisPathfinder.testIndex(coordinates[0] + 1, coordinates[1], routeID) &&
            !thisPathfinder.testIndex(coordinates[0] + 1, coordinates[1], testPathID)
          ) {
            testPath.push([coordinates[0] + 1, coordinates[1]]);
          }
          if (
            thisPathfinder.testIndex(coordinates[0] - 1, coordinates[1], routeID) &&
            !thisPathfinder.testIndex(coordinates[0] - 1, coordinates[1], testPathID)
          ) {
            testPath.push([coordinates[0] - 1, coordinates[1]]);
          }
          if (
            thisPathfinder.testIndex(coordinates[0], coordinates[1] + 1, routeID) &&
            !thisPathfinder.testIndex(coordinates[0], coordinates[1] + 1, testPathID)
          ) {
            testPath.push([coordinates[0], coordinates[1] + 1]);
          }
          if (
            thisPathfinder.testIndex(coordinates[0], coordinates[1] - 1, routeID) &&
            !thisPathfinder.testIndex(coordinates[0], coordinates[1] - 1, testPathID)
          ) {
            testPath.push([coordinates[0], coordinates[1] - 1]);
          }
        }
        if (testPath.length === path.length) {
          return false;
        } else {
          path.push([posX, posY]);
          return true;
        }
      }
    }
  }

  getIndex(posX, posY, pathArr) {
    const thisPathfinder = this;
    const path = thisPathfinder[pathArr];
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return path.indexOf(routeCoordinates);
      }
    }
    // return settings.noIndexValue;
  }

  testIndex(posX, posY, pathArr) {//scalić
    const thisPathfinder = this;
    const path = thisPathfinder[pathArr];
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return true;
      }
    }
    return false;
  }

  generateElemData(cell, posX, posY) {
    const thisPathfinder = this;
    cell.activeAdjacent = 0;
    const adjacencySelectors = {
      top: `[pos-x="${posX}"][pos-y="${posY - 1}"]`,
      left: `[pos-x="${posX - 1}"][pos-y="${posY}"]`,
      bottom: `[pos-x="${posX}"][pos-y="${posY + 1}"]`,
      right: `[pos-x="${posX + 1}"][pos-y="${posY}"]`,
    };
    for (let selector in adjacencySelectors) {
      const selectedElement = thisPathfinder.wrapper.querySelector(adjacencySelectors[selector]);
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
    const thisPathfinder = this;
    for (let cell of thisPathfinder.cells) {
      if (cell.posX === posX && cell.posY === posY) {
        console.log(cell);
        return cell;
      }
    }
  }

  initActions() {
    const thisPathfinder = this;
    const initCells = function(e) {
      if (e.target.closest(select.pathfinder.element)) {
        const clickedCell = thisPathfinder.selectCell(e.target.closest(select.pathfinder.element));
        thisPathfinder.selectPath(clickedCell);
      }
    };
    thisPathfinder.wrapper.addEventListener('click', initCells);
    thisPathfinder.controlsButton.addEventListener('click', function() {
      thisPathfinder.finishDrawing(initCells);
    });
  }

  getElements() {
    const thisPathfinder = this;
    thisPathfinder.controlsButton = document.querySelector(select.pathfinder.controlsButton);
    thisPathfinder.titleMessage = document.querySelector(select.pathfinder.messageTitle);
  }

  finishDrawing(functionToRemove) {//stworzyc obiekt z danymi i wyslac do 2 etapu
    const thisPathfinder = this;
    const path = thisPathfinder.route;
    if (path.length >= settings.pathfinder.minPathLength) {
      thisPathfinder.wrapper.removeEventListener('click', functionToRemove);
      thisPathfinder.controlsButton.innerHTML = settings.textContent.pickCells.btnText;
      thisPathfinder.titleMessage.innerHTML = settings.textContent.pickCells.title;
      thisPathfinder.initSecondStage();
    }
  }

  initSecondStage() {
    const thisPathfinder = this;
    thisPathfinder.selectedPoints = [];
    const initPoints = function (e) {
      if (e.target.closest(select.pathfinder.elementActive)) {
        thisPathfinder.selectPoint(e.target.closest(select.pathfinder.elementActive));
      }
    };
    thisPathfinder.wrapper.addEventListener('dblclick', initPoints);
  }

  selectPoint(element) {
    const thisPathfinder = this;
    const posX = element.posX;
    const posY = element.posY;
    if (
      thisPathfinder.selectedPoints.length < settings.pathfinder.maxPointNumber &&
      !thisPathfinder.testIndex(posX, posY, settings.pathfinder.selectedPoints)
    ) {
      thisPathfinder.selectedPoints.push([posX, posY]);
      element.classList.toggle(classNames.pathfinder.startEnd);
    } else if (thisPathfinder.testIndex(posX, posY, settings.pathfinder.selectedPoints)) {
      thisPathfinder.selectedPoints.splice(
        thisPathfinder.getIndex(posX, posY, settings.pathfinder.selectedPoints),
        1
      );
      element.classList.toggle(classNames.pathfinder.startEnd);
    }
  }
}

export default Pathfinder;

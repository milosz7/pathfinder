import { select, settings, classNames } from '../settings.js';

class Pathfinder {
  constructor(wrapper) {
    const thisPathfinder = this;
    thisPathfinder.wrapper = wrapper;
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
      gridElement.classList.add(classNames.pathfinder.element);
      gridElement.setAttribute('pos-x', posX);
      gridElement.setAttribute('pos-y', posY);
      if (posX % settings.pathfinder.coordinateLimitDefault === 0 && posX !== 0) {
        posY++;
        posX = 0;
      } else {
        posX++;
      }
      thisPathfinder.wrapper.appendChild(gridElement);
    }
  }

  selectPath(element) {
    const thisPathfinder = this;
    const clickedCoordinates = [];
    element.posX = parseInt(element.getAttribute('pos-x'), 10);
    element.posY = parseInt(element.getAttribute('pos-y'), 10);
    thisPathfinder.generateElemData(element, element.posX, element.posY);
    clickedCoordinates.push(element.posX, element.posY);
    element.classList.toggle(
      classNames.pathfinder.active,
      thisPathfinder.toggleStatus(clickedCoordinates, element)
    );
  }

  toggleStatus(coordinates, element) {
    const thisPathfinder = this;
    const path = thisPathfinder.route;
    const posX = element.posX;
    const posY = element.posY;
    if (!element.classList.contains(classNames.pathfinder.active)) {
      if (path.length === 0) {
        path.push(coordinates);
        return true;
      }
      if (element.activeAdjacent === 0) {
        return false;
      } else if (element.activeAdjacent > 0) {
        path.push(coordinates);
        return true;
      }
    } else {
      path.splice(thisPathfinder.getIndex(posX, posY), 1);
      const testPath = (thisPathfinder.testPath = []);
      const routeID = settings.pathfinder.routeID;
      const testPathID = settings.pathfinder.testPathID;
      const notIncluded = !thisPathfinder.testIndex(coordinates[0], coordinates[1], testPathID);
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

  getIndex(posX, posY) {
    const thisPathfinder = this;
    const path = thisPathfinder.route;
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return path.indexOf(routeCoordinates);
      }
    }
  }

  testIndex(posX, posY, pathArr) {
    const thisPathfinder = this;
    const path = thisPathfinder[pathArr];
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return true;
      }
    }
    return false;
  }

  generateElemData(element, posX, posY) {
    const thisPathfinder = this;
    element.activeAdjacent = 0;
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
        element.activeAdjacent++;
      }
    }
  }

  initActions() {
    const thisPathfinder = this;
    thisPathfinder.wrapper.addEventListener('click', function (e) {
      if (e.target.closest(select.pathfinder.element)) {
        thisPathfinder.selectPath(e.target.closest(select.pathfinder.element));
      }
    });
    thisPathfinder.controlsButton.addEventListener('click', function() {
      thisPathfinder.finishDrawing();
    });
  }

  getElements() {
    const thisPathfinder = this;
    thisPathfinder.controlsButton = document.querySelector(select.pathfinder.controlsButton);
    thisPathfinder.titleMessage = document.querySelector(select.pathfinder.messageTitle);
  }

  finishDrawing() {
    const thisPathfinder = this;
    const path = thisPathfinder.route;
    if (path.length >= settings.pathfinder.minPathLength) {
      const oldWrapper = thisPathfinder.wrapper;
      const newWrapper = oldWrapper.cloneNode(true);
      oldWrapper.parentNode.replaceChild(newWrapper, oldWrapper);
      thisPathfinder.controlsButton.innerHTML = settings.textContent.pickCells.btnText;
      thisPathfinder.titleMessage.innerHTML = settings.textContent.pickCells.title;
    }
  }
}

export default Pathfinder;

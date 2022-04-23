import {select, settings, classNames} from '../settings.js';

class Pathfinder {
  constructor(wrapper) {
    const thisPathfinder = this;
    thisPathfinder.wrapper = wrapper;
    thisPathfinder.route = [];
    thisPathfinder.createElements();
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
    thisPathfinder.hasCorner(element);
    element.classList.toggle(classNames.pathfinder.active, thisPathfinder.toggleStatus(clickedCoordinates, element));
  }

  toggleStatus(coordinates, element) {
    const thisPathfinder = this;
    const path = thisPathfinder.route;
    const posX = element.posX;
    const posY = element.posY;
    const adjacency = element.adjacencyData;
    const cornersActive = element.cornerData;
    // const data = thisPathfinder.ifIncludes(posX, posY);
    debugger;
    if (!element.classList.contains(classNames.pathfinder.active)) {
      if (path.length === 0) {
        path.push(coordinates);
        console.log(path);
        return true;
      }
      if (element.activeAdjacent === 0) {
        return false;
      } else if (element.activeAdjacent > 0) {
        path.push(coordinates);
        console.log(path);
        return true;
      }
    } else {//if active
      if (element.corners === 0 && path.length < 1) {
        path.splice(thisPathfinder.getIndex(posX, posY), 1);
        return true;
      } else if (
        (!adjacency.left && cornersActive.topRight && cornersActive.bottomRight && !adjacency.right) ||
        (!adjacency.right && cornersActive.topLeft && cornersActive.bottomLeft && !adjacency.left) ||
        (!adjacency.top && cornersActive.bottomRight && cornersActive.bottomLeft && !adjacency.bottom) ||
        (!adjacency.bottom && cornersActive.topRight && cornersActive.topLeft && !adjacency.top)
      ) {
        return true;
      } else if (element.activeAdjacent === 4 && element.corners < 3) {
        return true;
      } else if (
        (adjacency.left && adjacency.top && cornersActive.topLeft) ||
        (adjacency.left && adjacency.bottom && cornersActive.bottomLeft) ||
        (adjacency.right && adjacency.top && cornersActive.topRight) ||
        (adjacency.right && adjacency.bottom && cornersActive.bottomRight) 
      ) {
        path.splice(thisPathfinder.getIndex(posX, posY), 1);
        console.log(path);
        return false;
      } else if (element.activeAdjacent <= 1) {
        path.splice(thisPathfinder.getIndex(posX, posY), 1);
        console.log(path);
        return false;
      }
      console.log(path, 'edge case');
      return true;
    }
  }

  getIndex(posX, posY) {
    const thisPathfinder = this;
    const path = thisPathfinder.route;
    for (let routeCoordinates of path) {
      if (
        routeCoordinates[0] === posX &&
        routeCoordinates[1] === posY
      ) {
        console.log(path.indexOf(routeCoordinates));
        return path.indexOf(routeCoordinates);
      }
    }
  }

  hasCorner(element) {
    const thisPathfinder = this;
    const posX = element.posX;
    const posY = element.posY;
    element.corners = 0;
    element.cornerData = {
      topLeft: false,
      topRight: false,
      bottomLeft: false,
      bottomRight: false,
    };
    const cornerSelectors = {
      topLeft: `[pos-x="${posX - 1}"][pos-y="${posY - 1}"]`,
      topRight: `[pos-x="${posX + 1}"][pos-y="${posY - 1}"]`,
      bottomLeft: `[pos-x="${posX - 1}"][pos-y="${posY + 1}"]`,
      bottomRight: `[pos-x="${posX + 1}"][pos-y="${posY + 1}"]`,
    };
    for (let selector in cornerSelectors) {
      const cornerToCheck = thisPathfinder.wrapper.querySelector(cornerSelectors[selector]);
      if(cornerToCheck !== null && cornerToCheck.classList.contains(classNames.pathfinder.active)) {
        element.cornerData[selector] = true;
        element.corners++;
      }
    }
  }

  generateElemData(element, posX, posY) {
    const thisPathfinder = this;
    element.activeAdjacent = 0;
    element.adjacencyData = {
      top: false,
      left: false,
      bottom: false,
      right: false,
    };
    const adjacencySelectors = {
      top: `[pos-x="${posX}"][pos-y="${posY - 1}"]`,
      left: `[pos-x="${posX - 1}"][pos-y="${posY}"]`,
      bottom: `[pos-x="${posX}"][pos-y="${posY + 1}"]`,
      right: `[pos-x="${posX + 1}"][pos-y="${posY}"]`,
    };
    for (let selector in adjacencySelectors) {
      const selectedElement = thisPathfinder.wrapper.querySelector(adjacencySelectors[selector]);
      if (selectedElement !== null && selectedElement.classList.contains(classNames.pathfinder.active)) {
        element.activeAdjacent++;
        element.adjacencyData[selector] = true;
      }
    }
  }

  initActions() {
    const thisPathfinder = this;
    thisPathfinder.wrapper.addEventListener('click', function(e) {
      if (e.target.closest(select.pathfinder.element)) {
        thisPathfinder.selectPath(e.target.closest(select.pathfinder.element));
      }
    });
  }
}

export default Pathfinder;
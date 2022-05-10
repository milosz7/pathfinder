import { classNames, settings, select, textMessages } from '../settings.js';

class PathfinderThirdStage {
  constructor(data) {
    this.route = data.route;
    this.startPoint = data.selectedPoints[0];
    this.endPoint = data.selectedPoints[1];
    this.elementsInRow = data.elementsInRow;
    this.coordinateLimitDefault = data.coordinateLimitDefault;
    this.elementsAmount = data.elementsAmount;
    this.shortestPath = [];
    this.cells = data.cells;
    this.paths = {};
    this.initialPathID = 0;
    this.getElements();
    this.initPaths();
    this.switchPathInit();
  }

  getElements() {
    this.wrapper = document.querySelector(select.containerOf.pathfinder);
    this.controlsButton = document.querySelector(select.pathfinder.controlsButton);
    this.titleMessage = document.querySelector(select.pathfinder.messageTitle);
    this.summary = document.querySelector(select.containerOf.summary);
    this.sideMenuControls = document.querySelector(select.sideMenu.controls).children;
    this.sideMenuClickable = document.querySelector(select.sideMenu.button);
  }

  getCell(coordinates) {
    const posX = coordinates[0];
    const posY = coordinates[1];
    return this.cells[posY * this.elementsInRow + posX];
  }

  initPaths() {
    const endPointX = this.endPoint[0];
    const endPointY = this.endPoint[1];
    const startCell = this.getCell(this.startPoint);
    const adjacentCells = this.getAdjacent(startCell);
    for (let i = 0; i < startCell.activeAdjacent; i++) {
      const testPath = [this.startPoint];
      testPath.push(adjacentCells[i]);
      this.initialPathID++;
      this.paths[`testPath${this.initialPathID}`] = testPath;
    }
    for(let path in this.paths) {
      if (!this.testIndex(endPointX, endPointY, this.paths[path])) {
        this.propagatePath(path, this.paths[path]);
      } else if (this.paths[path].length === 2 && this.testIndex(endPointX, endPointY, this.paths[path])) {
        this.findShortest();
      }
    }
  }

  findShortest() {
    for (let path in this.paths) {
      if (
        (this.paths[path].length <= this.shortestPath.length &&
          this.testIndex(this.endPoint[0], this.endPoint[1], this.paths[path])) ||
        this.shortestPath.length === 0
      ) {
        this.shortestPath = this.paths[path];
      }
    }
    this.removeUnnecessaryPaths();
    this.shortestPath = this.paths[Object.keys(this.paths)[0]];
    this.initReset();
  }

  removeUnnecessaryPaths() {
    for (let path in this.paths) {
      if (
        this.paths[path].length !== this.shortestPath.length ||
        !this.testIndex(this.endPoint[0], this.endPoint[1], this.paths[path])
      ) {
        delete this.paths[path];
      }
    }
  }

  initReset() {
    this.displayShortest();  
    setTimeout(() => {
      this.displaySummary();
    }, settings.pathfinder.cellMarkupDelay * this.shortestPath.length + settings.summary.popupDelay);
    this.controlsButton.addEventListener('click', () => {
      const reset = new CustomEvent('reset', {
        bubbles: true,
      });
      this.controlsButton.textContent = textMessages.pathfinder.drawing.btnText;
      this.titleMessage.textContent = textMessages.pathfinder.drawing.title;
      this.controlsButton.replaceWith(this.controlsButton.cloneNode(true));
      for (let button of this.sideMenuControls) {
        button.replaceWith(button.cloneNode(true));
      }
      this.wrapper.dispatchEvent(reset);
    });
  }

  displayShortest() {
    for (let coordinates of this.shortestPath) {
      const cellToActivate = document.querySelector(`[pos-x="${coordinates[0]}"][pos-y="${coordinates[1]}"]`);
      setTimeout(() => {
        cellToActivate.classList.toggle(classNames.pathfinder.shortest);
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.indexOf(coordinates));
    }
  }

  switchPath(path) {
    for (let i = 1; i < path.length - 1; i++) {
      const coordinates = path[i];
      const cellToActivate = document.querySelector(`[pos-x="${coordinates[0]}"][pos-y="${coordinates[1]}"]`);
      setTimeout(() => {
        cellToActivate.classList.toggle(classNames.pathfinder.shortest);
      }, settings.pathfinder.cellMarkupDelay * path.indexOf(coordinates));
    }
  }

  switchPathInit() {
    const buttonPrev = this.sideMenuControls[0];
    const buttonNext = this.sideMenuControls[1];
    const pathKeys = Object.keys(this.paths);
    this.currentPathIndex = 0;
    buttonPrev.addEventListener('click', () => {
      for (let button of this.sideMenuControls) {
        button.disabled = true;
      }
      let oldIndex = this.currentPathIndex;
      if (this.currentPathIndex === 0) {
        this.currentPathIndex = pathKeys.length - 1;
        oldIndex = 0;
      } else {
        oldIndex = this.currentPathIndex--;
      }
      this.switchPath(this.paths[pathKeys[oldIndex]]);
      setTimeout(() => {
        this.switchPath(this.paths[pathKeys[this.currentPathIndex]]);
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.length);
      setTimeout(() => {
        for (let button of this.sideMenuControls) {
          button.disabled = false;
        }
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.length * 2);
    });
    buttonNext.addEventListener('click', () => {
      for (let button of this.sideMenuControls) {
        button.disabled = true;
      }
      let oldIndex = this.currentPathIndex;
      if (this.currentPathIndex === pathKeys.length - 1) {
        this.currentPathIndex = 0;
        oldIndex = pathKeys.length - 1;
      } else {
        oldIndex = this.currentPathIndex++;
      }
      this.switchPath(this.paths[pathKeys[oldIndex]]);
      setTimeout(() => {
        this.switchPath(this.paths[pathKeys[this.currentPathIndex]]);
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.length);
      setTimeout(() => {
        for (let button of this.sideMenuControls) {
          button.disabled = false;
        }
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.length * 2);
    });
  }

  displaySummary() {
    document.body.classList.add(classNames.page.blur);
    this.summary.classList.add(classNames.summary.active);
    const routeOutput = this.summary.querySelector(select.summary.routeLength);
    const pathsNumberOutput = this.summary.querySelector(select.summary.pathsNumber);
    const routeShortestOutput = this.summary.querySelector(select.summary.routeShortest);
    routeOutput.innerHTML = this.route.length;
    pathsNumberOutput.innerHTML = Object.keys(this.paths).length;
    routeShortestOutput.innerHTML = this.shortestPath.length;
    this.sideMenuClickable.classList.toggle(classNames.sideNav.display, Object.keys(this.paths).length > 1);
  }

  checkPaths(endPointX, endPointY) {
    let finishedPaths = 0;
    let unfinishedPaths = 0;
    for (let path in this.paths) {
      if (this.testIndex(endPointX, endPointY, this.paths[path])) {
        finishedPaths++;
      } else {
        unfinishedPaths++;
      }
    }
    return [finishedPaths, unfinishedPaths];
  }

  testSplit(reducedAdjacent) {
    for (let coordinates of reducedAdjacent) {
      const cellToCheck = this.getCell(coordinates);
      if (cellToCheck.activeAdjacent <= 2) {
        return false;
      }
    }
    return true;
  }

  reduceAdjacent(adjacentCells, pathArr) {
    const thisPath = this;
    const reducedAdjacent = adjacentCells.reduce(function(uniqueCoordinates, coordinateToCheck) {
      if(!thisPath.testIndex(coordinateToCheck[0], coordinateToCheck[1], pathArr))  {
        uniqueCoordinates.push(coordinateToCheck); 
      }
      return uniqueCoordinates;
    }, []);
    return reducedAdjacent;
  }

  propagatePath(pathName, pathArr) { 
    const pointToCheck = pathArr[pathArr.length - 1];
    const cellToCheck = this.getCell(pointToCheck);
    let pathBeforeSplit = JSON.parse(JSON.stringify(pathArr));
    const adjacentCells = this.getAdjacent(cellToCheck);
    const reducedAdjacent = this.reduceAdjacent(adjacentCells, pathArr);

    if (reducedAdjacent.length > 1 && this.testSplit(reducedAdjacent)) {
      const distancesFromEnd = [];
      for (let coordinates of reducedAdjacent) {
        const distance = Math.abs(coordinates[0] - this.endPoint[0]) + Math.abs(coordinates[1] - this.endPoint[1]);
        distancesFromEnd.push(distance);
      }
      const farthestCell = Math.max(...distancesFromEnd);
      for (let distance of distancesFromEnd) {
        if (distance === farthestCell && reducedAdjacent.length !== 1) {
          const toRemove = distancesFromEnd.indexOf(distance);
          reducedAdjacent.splice(toRemove, 1);
        }
      }
    }
    if (reducedAdjacent.length === 0) {
      delete this.paths[pathName];
    } else if (cellToCheck.activeAdjacent > 2) {
      for (let i = 0; i < reducedAdjacent.length; i++) {
        if (i === 0) {
          this.paths[pathName].push(reducedAdjacent[i]);
        } else {
          this.initialPathID++;
          this.paths[`testPath${this.initialPathID}`] = pathBeforeSplit;
          this.paths[`testPath${this.initialPathID}`].push(reducedAdjacent[i]);
          if (reducedAdjacent.length === 3) {
            pathBeforeSplit = JSON.parse(JSON.stringify(pathArr));
            pathBeforeSplit.pop();
          }
        }
      }
    } else if (cellToCheck.activeAdjacent === 2 || reducedAdjacent.length === 1) {
      pathArr.push(reducedAdjacent[0]);
    }
    this.checkPathStatus();
  }

  checkPathStatus() {
    const pathsData = this.checkPaths(this.endPoint[0], this.endPoint[1]);
    const unfinishedPaths = pathsData[1];
    const finishedPaths = pathsData[0];
    if (finishedPaths >= settings.pathfinder.pathGenerationLimit || unfinishedPaths === 0) {
      this.findShortest();
    } else {
      for(let path in this.paths) {
        if (!this.testIndex(this.endPoint[0], this.endPoint[1], this.paths[path])) {
          this.propagatePath(path, this.paths[path]);
        }
      }
    }  
  }

  testIndex(posX, posY, path) {
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return true;
      }
    }
    return false;
  }

  getAdjacent(cell) {
    const adjacentCells = [];
    const posX = cell.posX;
    const posY = cell.posY;
    if (this.testIndex(posX - 1, posY, this.route)) {
      adjacentCells.push([posX - 1, posY]);
    }
    if (this.testIndex(posX + 1, posY, this.route)) {
      adjacentCells.push([posX + 1, posY]);
    }
    if (this.testIndex(posX, posY - 1, this.route)) {
      adjacentCells.push([posX, posY - 1]);
    }
    if (this.testIndex(posX, posY + 1, this.route)) {
      adjacentCells.push([posX, posY + 1]);
    }
    return adjacentCells;
  }
}

export default PathfinderThirdStage;
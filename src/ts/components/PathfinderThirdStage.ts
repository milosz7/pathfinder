import { classNames, settings, select, textMessages } from '../settings.js';
import { cell, stageBase, cellCoordinates, coordinateArr } from '../interfaces'

interface constructorData extends stageBase {
  selectedPoints: coordinateArr;
}

interface classProps extends stageBase {
  selectedPoints: coordinateArr;
  dom: { [key: string]: HTMLElement };
  startPoint: cellCoordinates;
  endPoint: cellCoordinates;
  shortestPath: coordinateArr;
  paths: {[key: string]: coordinateArr};
  initialPathID: number;
  currentPathIndex: number;
  sideMenuControls: HTMLCollection;
}

interface PathfinderThirdStage extends classProps {}

class PathfinderThirdStage {
  constructor(data: constructorData) {
    debugger;
    this.dom = {};
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
    this.dom.wrapper = document.querySelector(select.containerOf.pathfinder)!;
    this.dom.controlsButton = document.querySelector(select.pathfinder.controlsButton)!;
    this.dom.titleMessage = document.querySelector(select.pathfinder.messageTitle)!;
    this.dom.summary = document.querySelector(select.containerOf.summary)!;
    this.sideMenuControls = document.querySelector(select.sideMenu.controls)!.children;
    this.dom.sideMenuClickable = document.querySelector(select.sideMenu.button)!;
  }

  getCell(coordinates: cellCoordinates) {
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
    this.dom.controlsButton.addEventListener('click', () => {
      const reset = new CustomEvent('reset', {
        bubbles: true,
      });
      this.dom.controlsButton.textContent = textMessages.pathfinder.drawing.btnText;
      this.dom.titleMessage.textContent = textMessages.pathfinder.drawing.title;
      this.dom.controlsButton.replaceWith(this.dom.controlsButton.cloneNode(true));
      for (let button of this.sideMenuControls) {
        button.replaceWith(button.cloneNode(true));
      }
      this.dom.wrapper.dispatchEvent(reset);
    });
  }

  displayShortest() {
    for (let coordinates of this.shortestPath) {
      const cellToActivate = document.querySelector(`[pos-x="${coordinates[0]}"][pos-y="${coordinates[1]}"]`)!;
      setTimeout(() => {
        cellToActivate.classList.toggle(classNames.pathfinder.shortest);
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.indexOf(coordinates));
    }
  }

  switchPath(path: coordinateArr) {
    for (let i = 1; i < path.length - 1; i++) {
      const coordinates = path[i];
      const cellToActivate = document.querySelector(`[pos-x="${coordinates[0]}"][pos-y="${coordinates[1]}"]`)!;
      setTimeout(() => {
        cellToActivate.classList.toggle(classNames.pathfinder.shortest);
      }, settings.pathfinder.cellMarkupDelay * path.indexOf(coordinates));
    }
  }

  switchPathInit() {
    const buttonPrev = this.sideMenuControls[0] as HTMLButtonElement;
    const buttonNext = this.sideMenuControls[1] as HTMLButtonElement;
    const pathKeys = Object.keys(this.paths);
    this.currentPathIndex = 0;
    buttonPrev.addEventListener('click', () => {
      for (let button of this.sideMenuControls as unknown as HTMLButtonElement[]) {
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
        for (let button of this.sideMenuControls as unknown as HTMLButtonElement[]) {
          button.disabled = false;
        }
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.length * 2);
    });
    buttonNext.addEventListener('click', () => {
      for (let button of this.sideMenuControls as unknown as HTMLButtonElement[]) {
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
        for (let button of this.sideMenuControls as unknown as HTMLButtonElement[]) {
          button.disabled = false;
        }
      }, settings.pathfinder.cellMarkupDelay * this.shortestPath.length * 2);
    });
  }

  displaySummary() {
    document.body.classList.add(classNames.page.blur);
    this.dom.summary.classList.add(classNames.summary.active);
    const routeOutput = this.dom.summary.querySelector(select.summary.routeLength)!;
    const pathsNumberOutput = this.dom.summary.querySelector(select.summary.pathsNumber)!;
    const routeShortestOutput = this.dom.summary.querySelector(select.summary.routeShortest)!;
    routeOutput.innerHTML = this.route.length.toString();
    pathsNumberOutput.innerHTML = Object.keys(this.paths).length.toString();
    routeShortestOutput.innerHTML = this.shortestPath.length.toString();
    this.dom.sideMenuClickable.classList.toggle(classNames.sideNav.display, Object.keys(this.paths).length > 1);
  }

  checkPaths(endPointX: number, endPointY: number) {
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

  testSplit(reducedAdjacent: coordinateArr) {
    for (let coordinates of reducedAdjacent) {
      const cellToCheck = this.getCell(coordinates);
      if (cellToCheck.activeAdjacent <= 2) {
        return false;
      }
    }
    return true;
  }

  reduceAdjacent(adjacentCells: coordinateArr, pathArr: coordinateArr) {
    const reducedAdjacent: coordinateArr = adjacentCells.reduce((uniqueCoordinates: coordinateArr, coordinateToCheck: cellCoordinates) => {
      if(!this.testIndex(coordinateToCheck[0], coordinateToCheck[1], pathArr))  {
        uniqueCoordinates.push(coordinateToCheck); 
      }
      return uniqueCoordinates;
    }, []);
    return reducedAdjacent;
  }

  propagatePath(pathName: string, pathArr: coordinateArr) { 
    const pointToCheck = pathArr[pathArr.length - 1];
    const cellToCheck = this.getCell(pointToCheck);
    let pathBeforeSplit = JSON.parse(JSON.stringify(pathArr));
    const adjacentCells = this.getAdjacent(cellToCheck);
    const reducedAdjacent = this.reduceAdjacent(adjacentCells, pathArr);

    if (reducedAdjacent.length > 1 && this.testSplit(reducedAdjacent)) {
      const distancesFromEnd: number[] = [];
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

  testIndex(posX: number, posY: number, path: coordinateArr) {
    for (let routeCoordinates of path) {
      if (routeCoordinates[0] === posX && routeCoordinates[1] === posY) {
        return true;
      }
    }
    return false;
  }

  getAdjacent(cell: cell) {
    const adjacentCells: coordinateArr = [];
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
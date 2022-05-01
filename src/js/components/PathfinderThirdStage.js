import { classNames } from '../settings.js';

class PathfinderThirdStage {
  constructor(data) {
    this.route = data.route;
    this.startPoint = data.selectedPoints[0];
    this.endPoint = data.selectedPoints[1];
    this.selectedPoints = data.selectedPoints;
    this.cells = data.cells;
    this.paths = {};
    this.shortestPath = [];
    this.initialPathID = 0;
    this.initPaths();
  }

  getCell(coordinates) {
    const posX = coordinates[0];
    const posY = coordinates[1];
    for (let cell of this.cells) {
      if (cell.posX === posX && cell.posY === posY) {
        return cell;
      }
    }
  }

  initPaths() {
    const endPointX = this.endPoint[0];
    const endPointY = this.endPoint[1];
    const startCell = this.getCell(this.startPoint);
    const adjacentCells = this.getAdjacent(startCell);
    if (startCell.activeAdjacent !== 1) {
      for (let i = 0; i < startCell.activeAdjacent; i++) {
        const testPath = [this.startPoint];
        testPath.push(adjacentCells[i]);
        this.initialPathID++;
        this.paths[`testPath${this.initialPathID}`] = testPath;
      }
    } else {
      const testPath = [this.startPoint];
      testPath.push(adjacentCells[0]);
      this.initialPathID++;
      this.paths[`testPath${this.initialPathID}`] = testPath;
    }
    for(let path in this.paths) {
      if (!this.testIndex(endPointX, endPointY, this.paths[path])) {
        this.propagatePath(path, this.paths[path]);
      }
    }
    if (this.checkPaths(endPointX, endPointY) === 0) {
      this.findShortest();
    }
  }

  findShortest() {
    for (let path in this.paths) {
      if (this.paths[path].length < this.shortestPath.length || this.shortestPath.length === 0) {
        this.shortestPath = this.paths[path];
      }
    }
    this.markShortest();
  }

  markShortest() {
    for (let coordinates of this.shortestPath) {
      const cellToActivate = document.querySelector(`[pos-x="${coordinates[0]}"][pos-y="${coordinates[1]}"]`);
      cellToActivate.classList.add(classNames.pathfinder.shortest);
    }
  }

  checkPaths(endPointX, endPointY) {
    let unfinishedPaths = 0;
    for (let path in this.paths) {
      if (!this.testIndex(endPointX, endPointY, this.paths[path])) {
        unfinishedPaths++;
      }
    }
    return unfinishedPaths;
  }

  propagatePath(pathName, pathArr) { 
    const thisPath = this;
    const pointToCheck = pathArr[pathArr.length - 1];
    const cellToCheck = this.getCell(pointToCheck);
    const pathBeforeSplit = JSON.parse(JSON.stringify(pathArr));
    const adjacentCells = this.getAdjacent(cellToCheck);
    const reducedAdjacent = adjacentCells.reduce(function(uniqueCoordinates, coordinateToCheck) {
      if(!thisPath.testIndex(coordinateToCheck[0], coordinateToCheck[1], pathArr))  {
        uniqueCoordinates.push(coordinateToCheck);
        
      }
      return uniqueCoordinates;
    }, []);
    if (reducedAdjacent.length === 0) {
      delete this.paths[pathName];
    }

    if(cellToCheck.activeAdjacent > 2 && reducedAdjacent.length !== 0) {
      for (let i = 0; i < reducedAdjacent.length; i++) {
        if (i === 0 && !this.testIndex(reducedAdjacent[i][0], reducedAdjacent[i][1], this.paths[pathName])) {
          this.paths[pathName].push(reducedAdjacent[i]);
        } else if(!this.testIndex(reducedAdjacent[i][0], reducedAdjacent[i][1], this.paths[pathName])){
          this.initialPathID++;
          this.paths[`testPath${this.initialPathID}`] = pathBeforeSplit;
          this.paths[`testPath${this.initialPathID}`].push(reducedAdjacent[i]);
        }
        
      }
      
    } else if(cellToCheck.activeAdjacent === 2 && reducedAdjacent.length !== 0) {
      for (let coordinates of reducedAdjacent) {
        if (!this.testIndex(coordinates[0], coordinates[1], this.paths[pathName])) {
          pathArr.push(coordinates);
        }
      }
    }
    for(let path in this.paths) {
      if (!this.testIndex(this.endPoint[0], this.endPoint[1], this.paths[path])) {
        this.propagatePath(path, this.paths[path]);
      }
    }
    if (this.checkPaths(this.endPoint[0], this.endPoint[1]) === 0) {
      this.findShortest();
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
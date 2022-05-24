import {classNames} from '../settings.js';

interface cellData {
  posX: number
  posY: number;
  wrapper: HTMLElement;
  activeAdjacent: number;
}

interface PathfinderCell extends cellData {}

class PathfinderCell {
  constructor(wrapper: HTMLElement, posX: number, posY: number) {
    this.wrapper = wrapper;
    this.activeAdjacent = 0;
    this.posX = posX;
    this.posY = posY;
    this.initData();
  }

  initData() {
    this.wrapper.classList.add(classNames.pathfinder.element);
    this.wrapper.setAttribute('pos-x', this.posX.toString());
    this.wrapper.setAttribute('pos-y', this.posY.toString());
  }
}

export default PathfinderCell;
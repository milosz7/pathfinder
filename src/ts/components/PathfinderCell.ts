import {classNames} from '../settings.js';

class PathfinderCell {
  posX: number
  posY: number;
  wrapper: HTMLElement;
  activeAdjacent: number;
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
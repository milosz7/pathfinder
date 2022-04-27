import {classNames} from '../settings.js';

class PathfinderCell {
  constructor(wrapper, posX, posY) {
    this.wrapper = wrapper;
    this.posX = posX;
    this.posY = posY;
    this.initData();
  }

  initData() {
    this.wrapper.classList.add(classNames.pathfinder.element);
    this.wrapper.setAttribute('pos-x', this.posX);
    this.wrapper.setAttribute('pos-y', this.posY);
  }
}

export default PathfinderCell;
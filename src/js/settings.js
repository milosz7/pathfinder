

export const select = {
  containerOf: {
    nav: '.nav',
    pages: '#pages',
    about: '#about',
    finder: '#finder,',
    pathfinder: '.pathfinder-grid',
  },
  nav: {
    links: '.nav__link',
  },
  pathfinder: {
    element: '.grid-element',
    elementActive: '.active',
    controlsButton: '.pathfinder-controls',
    messageTitle: '.pathfinder-message',
  },
};

export const classNames = {
  page: {
    active: 'active',
  },
  navLink: {
    active: 'active',
  },
  pathfinder: {
    element: 'grid-element',
    active: 'active',
  }
};

export const settings = {
  pathfinder: {
    elementsAmountDefault: 100,
    coordinateLimitDefault: 9,
    testPathID: 'testPath',
    routeID: 'route',
    minPathLength: 3,
  },
  textContent: {
    drawing: {
      title: 'Draw routes',
      btnText: 'Finish Drawing',
    },
    pickCells: {
      title: 'Pick start and finish',
      btnText: 'Compute',
    },
    result: {
      title: 'The best route is...',
      btnText: 'Start again',
    },
  },
};
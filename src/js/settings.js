

export const select = {
  containerOf: {
    nav: '.nav',
    pages: '#pages',
    about: '#about',
    finder: '#finder,',
    pathfinder: '.pathfinder-grid',
    messageBox: '.toast',
  },
  nav: {
    links: '.nav__link',
  },
  pathfinder: {
    element: '.grid-element',
    elementActive: '.grid-element.active',
    controlsButton: '.pathfinder-controls',
    messageTitle: '.pathfinder-message',
  },
  messageBox: {
    text: '.toast__text',
  }
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
    startEnd: 'start-end',
    shortest: 'shortest',
  },
  messageBox: {
    active: 'active',
  },
};

export const settings = {
  pathfinder: {
    elementsAmountDefault: 100,
    coordinateLimitDefault: 9,
    testPathID: 'testPath',
    routeID: 'route',
    selectedPoints: 'selectedPoints',
    minPathLength: 3,
    maxPointNumber: 2,
    pathGenerationLimit: 10,
  },
  messageBox: {
    displayTime: 1500,
  },
};

export const textMessages = {
  pathfinder: {
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
  errors: {
    notAdjacent: 'Please select a cell that is adjacent to active ones.',
    pathTooShort: 'Path has to consist of at least ' + settings.pathfinder.minPathLength + ' cells.',
    breakPath: 'You cannot remove this cell as it will break the path.',
    choosePoints: 'Please choose both start and end point.',
    tooManyPoints: 'The maximum number of start/end points you can choose is ' + settings.pathfinder.maxPointNumber + '.',
    notInRoute: 'Please select a cell that is a part of a route.',
  },
};
export const select = {
  containerOf: {
    nav: '.nav',
    pages: '#pages',
    about: '#about',
    finder: '#finder',
    pathfinder: '.pathfinder-grid',
    messageBox: '.toast',
    rules: '.rules',
    summary: '.summary',
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
  rules: {
    rulesDisplayButton: '.rules-button',
  },
  buttons: {
    hideButton: '.btn-hide',
  },
  sideMenu: {
    button: '.side-nav',
    controls: '.side-nav .buttons-box',
    buttonPrev: '.prev',
    buttonNext: '.next',
    title: '.side-nav__title',
    arrow: '.side-nav__arrow',
  },
  summary: {
    routeLength: '.route-length',
    pathsNumber: '.paths-number',
    routeShortest: '.route-shortest',
  },
  messageBox: {
    text: '.toast__text',
  }
};

export const classNames = {
  page: {
    active: 'active',
    blur: 'blur',
  },
  navLink: {
    active: 'active',
  },
  pathfinder: {
    update: 'update',
    element: 'grid-element',
    active: 'active',
    startEnd: 'start-end',
    shortest: 'shortest',
    clickable: 'clickable',
  },
  messageBox: {
    active: 'active',
  },
  rulesBox: {
    active: 'active',
  },
  summary: {
    active: 'active',
  },
  sideNav: {
    containerClass: 'side-nav',
    active: 'active',
    display: 'display',
    hide: 'hide',
  }
};

export const settings = {
  pathfinder: {
    elementsAmountDefault: 100,
    coordinateLimitDefault: 9,
    elementsInRow: 10,
    testPathID: 'testPath' as const,
    routeID: 'route' as const,
    selectedPoints: 'selectedPoints' as const,
    minPathLength: 3,
    maxPointNumber: 2,
    pathGenerationLimit: 10,
    gridReloadTime: 1000,
    cellMarkupDelay: 100,
  },
  pathfinderMobile: {
    elementsAmountDefault: 36,
    coordinateLimitDefault: 5,
    elementsInRow: 6,
  },
  messageBox: {
    displayTime: 3000,
  },
  summary: {
    popupDelay: 300,
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


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
  }
};
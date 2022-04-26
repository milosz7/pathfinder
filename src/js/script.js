import {select, classNames} from './settings.js';
import Pathfinder from './components/Pathfinder.js';

const app = {

  init: function() {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initPathfinder();
  },

  initPages: function() {
    const thisApp = this;
    thisApp.navWrapper = document.querySelector(select.containerOf.nav);
    thisApp.navLinks = thisApp.navWrapper.querySelectorAll(select.nav.links);
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    const IDFromHash = (window.location.hash).slice(2);
    for (let link of thisApp.navLinks) {
      const pageID = link.getAttribute('href').replace('#', '');
      if(IDFromHash === pageID) {
        app.activatePage(IDFromHash);
      } else {
        app.activatePage(thisApp.navLinks[0].getAttribute('href').replace('#', ''));
      }
      link.addEventListener('click', function(e) {
        e.preventDefault();
        app.activatePage(pageID);
      });
    } 
  },

  activatePage: function(pageID) {
    const thisApp = this;
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.page.active, page.id === pageID);
    }
    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.navLink.active, link.getAttribute('href') === '#' + pageID);
    }
    window.location.hash = `/${pageID}`;
  },

  initPathfinder: function() {
    const thisApp = this;
    const pathfinderWrapper = document.querySelector(select.containerOf.pathfinder);
    thisApp.pathfinder = new Pathfinder(pathfinderWrapper);
  }

};

app.init();
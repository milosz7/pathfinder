import {select, classNames} from './settings.js';
import Pathfinder from './components/Pathfinder.js';

const app = {

  init: function() {
    this.initPages();
    this.initPathfinder();
    this.initReset(); 
  },

  initPages: function() {
    this.navWrapper = document.querySelector(select.containerOf.nav);
    this.navLinks = this.navWrapper.querySelectorAll(select.nav.links);
    this.pages = document.querySelector(select.containerOf.pages).children;
    const IDFromHash = (window.location.hash).slice(2);
    for (let link of this.navLinks) {
      const pageID = link.getAttribute('href').replace('#', '');
      if(IDFromHash === pageID) {
        app.activatePage(IDFromHash);
      } else {
        app.activatePage(this.navLinks[0].getAttribute('href').replace('#', ''));
      }
      link.addEventListener('click', function(e) {
        e.preventDefault();
        app.activatePage(pageID);
      });
    } 
  },

  activatePage: function(pageID) {
    for (let page of this.pages) {
      page.classList.toggle(classNames.page.active, page.id === pageID);
    }
    for (let link of this.navLinks) {
      link.classList.toggle(classNames.navLink.active, link.getAttribute('href') === '#' + pageID);
    }
    window.location.hash = `/${pageID}`;
  },

  initPathfinder: function() {
    this.wrapper = document.querySelector(select.containerOf.pathfinder);
    this.pathfinder = new Pathfinder(this.wrapper);
  },

  initReset: function() {
    this.wrapper.addEventListener('reset', () => {
      this.wrapper.innerHTML = '';
      this.pathfinder = new Pathfinder(this.wrapper);
    });
  }

};

app.init();
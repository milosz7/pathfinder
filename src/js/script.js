import {select, classNames} from './settings.js';
import Pathfinder from './components/Pathfinder.js';

const app = {

  init: function() {
    this.initPages();
    this.initPathfinder();
    this.initButtons();
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
    if (window.location.hash !== '#/finder') {
      // eslint-disable-next-line no-undef
      AOS.refresh();
    }
    
  },

  initPathfinder: function() {
    this.wrapper = document.querySelector(select.containerOf.pathfinder);
    this.pathfinder = new Pathfinder(this.wrapper);
  },

  initReset: function() {
    this.wrapper.addEventListener('reset', () => {
      this.wrapper.innerHTML = '';
      this.pathfinder = new Pathfinder(this.wrapper);
      this.sideMenuButton.classList.toggle(
        classNames.sideNav.hide,
        this.sideMenuButton.classList.contains(classNames.sideNav.active)
      );
      this.sideMenuButton.classList.toggle(
        classNames.sideNav.active,
        this.sideMenuButton.classList.contains(classNames.sideNav.hide)
      );
      this.sideMenuControls.classList.remove(classNames.sideNav.active);
      this.sideMenuTitle.classList.remove(classNames.sideNav.active);
      this.sideMenuButton.className = classNames.sideNav.containerClass;
    });
  },

  initButtons: function() {
    const rulesBox = document.querySelector(select.containerOf.rules);
    this.rulesButton = document.querySelector(select.rules.rulesDisplayButton);
    this.rulesHideButtons = document.querySelectorAll(select.buttons.hideButton);
    this.sideMenuButton = document.querySelector(select.sideMenu.button);
    this.sideMenuControls = document.querySelector(select.sideMenu.controls);
    this.sideMenuTitle = document.querySelector(select.sideMenu.title);

    this.rulesButton.addEventListener('click', () => {
      document.body.classList.add(classNames.page.blur);
      rulesBox.classList.add(classNames.rulesBox.active);
    });
    for (let button of this.rulesHideButtons) {
      button.addEventListener('click', () => {
        document.body.classList.remove(classNames.page.blur);
        button.parentElement.classList.remove(classNames.rulesBox.active);
      });
    }
    this.sideMenuButton.addEventListener('click', (e) => {
      if (!e.target.closest(select.sideMenu.controls)) {
        this.sideMenuControls.classList.toggle(classNames.sideNav.active);
        this.sideMenuTitle.classList.toggle(classNames.sideNav.active);
        const arrow = this.sideMenuButton.querySelector(select.sideMenu.arrow);
        arrow.classList.toggle(classNames.sideNav.active);
        this.sideMenuButton.classList.toggle(
          classNames.sideNav.hide,
          this.sideMenuButton.classList.contains(classNames.sideNav.active)
        );
        this.sideMenuButton.classList.toggle(
          classNames.sideNav.active,
          !this.sideMenuButton.classList.contains(classNames.sideNav.hide)
        );
      }
      
    });
  }
};

app.init();
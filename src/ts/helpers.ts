import { select, classNames, settings } from './settings.js';

const helpers = {
  
  displayMessage: function(msg: string) {
    const messageBox = document.querySelector(select.containerOf.messageBox)!;
    const messageText = messageBox.querySelector(select.messageBox.text)!;
    messageText.innerHTML = msg;
    if (!messageBox.classList.contains(classNames.messageBox.active)) {
      messageBox.classList.toggle(classNames.messageBox.active);
      setTimeout(function() {
        messageBox.classList.toggle(classNames.messageBox.active);
      }, settings.messageBox.displayTime);
    }
  },

  isMobile: function() {
    const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
    return isMobileDevice;
  }, 
};

export default helpers;
import { select, classNames, settings } from './settings.js';

const helpers = {
  
  displayMessage: function(msg) {
    const messageBox = document.querySelector(select.containerOf.messageBox);
    const messageText = messageBox.querySelector(select.messageBox.text);
    messageText.innerHTML = msg;
    messageBox.classList.toggle(classNames.messageBox.active);
    setTimeout(function() {
      messageBox.classList.toggle(classNames.messageBox.active);
    }, settings.messageBox.displayTime);
  }
};

export default helpers;
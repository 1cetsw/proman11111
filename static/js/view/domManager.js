export let domManager = {
  addChild(parentIdentifier, childContent) {
    const parent = document.querySelector(parentIdentifier);
    if (parent) {
      parent.insertAdjacentHTML("beforeend", childContent);
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },

  addEventListener(parentIdentifier, eventType, eventHandler) {
    const parent = document.querySelector(parentIdentifier);
    if (parent) {
      parent.addEventListener(eventType, eventHandler);
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },

  addEventListenerToMore(parentIdentifier, eventType, eventHandler) {
    const parents = document.querySelectorAll(parentIdentifier);
    if (parents.length > 0) {
      for (let i=0; i<parents.length; i++ ) {
        parents[i].addEventListener(eventType, eventHandler);

      }
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },

};


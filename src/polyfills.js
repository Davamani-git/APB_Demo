// Polyfills for Angular 18
(function() {
  'use strict';
  
  // Zone.js is required by Angular
  if (!window.Zone) {
    console.warn('Zone.js not loaded');
  }
})();
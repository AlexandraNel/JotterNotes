// This file is designed to manage the installation of a Progressive Web App (PWA) on a user's device. 
// This script interacts with the browser's PWA installation prompts and handles user-triggered installation events.

const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// listening for installation event
window.addEventListener('beforeinstallprompt', (event) => {// Store the triggered events
    window.deferredPrompt = event;

    // Remove the hidden class from the button.
    butInstall.classList.toggle('hidden', false);
  });


// Listening for the click
butInstall.addEventListener('click', async () => {
  
    const promptEvent = window.deferredPrompt;
  
    if (!promptEvent) {
     return;
    }
  
    // Show prompt
    promptEvent.prompt();
    
    // Reset the deferred prompt variable, it can only be used once.
    window.deferredPrompt = null;
    
    butInstall.classList.toggle('hidden', true);
  });

// if app is already installed on computer- no install button
window.addEventListener('appinstalled', (event) => {
    // Clear prompt
    window.deferredPrompt = null;
  }); 

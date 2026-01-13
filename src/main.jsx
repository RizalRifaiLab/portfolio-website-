import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('avatar-3d-container');
let avatarLoaded = false;

// Function to load avatar on demand
async function loadAvatar() {
    if (avatarLoaded) return;
    avatarLoaded = true;

    const { default: AvatarScene } = await import('../three_js/avatar.jsx');

    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <AvatarScene />
            </React.StrictMode>
        );
    }
}

// Load avatar after a short delay OR on first user interaction
const interactionEvents = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];

function onInteraction() {
    loadAvatar();
    // Remove listeners after first interaction
    interactionEvents.forEach(event => {
        document.removeEventListener(event, onInteraction, { passive: true });
    });
}

// Attach interaction listeners
interactionEvents.forEach(event => {
    document.addEventListener(event, onInteraction, { passive: true, once: true });
});

// Fallback: Load after 2 seconds if no interaction
setTimeout(() => {
    loadAvatar();
}, 2000);

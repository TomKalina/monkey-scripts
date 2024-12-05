// ==UserScript==
// @name     Github custom
// @include  https://github.com/*
// @author   Tomas Kalina
// @grant    GM_addStyle
// @run-at   document-start
// @require  file:///Users/tom/dev/monkey-scripts/github.user.js
// ==/UserScript==

console.log("Github script loaded");

(function() {
    "use strict";

    // Function to hide the button
    function hideButton() {
        const button = document.querySelector('[data-testid="filter-actions-save-changes-button"]');
        if (button) {
            button.style.display = "none";
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                hideButton();
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial call to hide the button in case it's already present
    hideButton();
})();
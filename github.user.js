// ==UserScript==
// @name         Github Custom CSS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Globally modify CSS for specific GitHub elements
// @author       Tomas Kalina
// @match        https://github.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    "use strict";

    // Add global CSS styles for specific elements
    GM_addStyle(`
        [data-testid="filter-actions-save-changes-button"] {
            display: none !important;
        }

        [data-testid="board-view-column"] {
            min-width: 200px !important;
        }
    `);

    console.log("Custom CSS for GitHub applied");
})();

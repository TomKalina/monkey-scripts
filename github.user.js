// ==UserScript==
// @name         GitHub Project Column Resizer
// @namespace    https://github.com/
// @version      1.2
// @description  Změní šířku sloupců na 200px v GitHub Projects
// @author       ChatGPT
// @match        https://github.com/orgs/shoptet/projects/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('GitHub Project Column Resizer is running...');
    function resizeColumns() {
        const columns = document.querySelectorAll('[data-board-column]');
        columns.forEach(col => {
            col.style.minWidth = '200px';
        });
    }

    function removeSaveButton() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const span = button.querySelector('span');
            if (span && span.textContent.trim() === "Save") {
                button.remove();
            }
        });
    }

    function runAllModifications() {
        resizeColumns();
        // removeSaveButton();
    }

    // Spustí se po načtení stránky
    window.addEventListener('load', () => {
        setTimeout(runAllModifications, 2000); // Počká na načtení sloupců a tlačítek
    });

    // Sleduje změny na stránce a upravuje sloupce + tlačítka dynamicky
    const observer = new MutationObserver(() => {
        runAllModifications();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
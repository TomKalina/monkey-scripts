// ==UserScript==
// @name         Asana – potvrzení dokončení úkolu
// @namespace    https://github.com/TomKalina/monkey-scripts
// @version      1.0.0
// @description  Vyžádá potvrzení před kliknutím na dokončení úkolu v Asaně.
// @match        https://app.asana.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL  https://github.com/TomKalina/monkey-scripts/raw/main/asana.user.js
// @updateURL    https://github.com/TomKalina/monkey-scripts/raw/main/asana.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Match action labels, never a task title or an entire task row.
    // Add translations here if your Asana interface uses another language.
    const completionLabel = /^(?:mark (?:task )?(?:as )?complete|complete task|označit (?:úkol )?jako (?:dokončený|dokončené|dokončenou|hotový|hotové)|dokončit úkol)$/i;
    const reopeningLabel = /^(?:mark (?:task )?(?:as )?incomplete|completed|označit (?:úkol )?jako (?:nedokončený|nedokončené|nedokončenou)|dokončeno|hotovo)$/i;
    const controlSelector = 'button, [role="button"], [role="checkbox"], input[type="checkbox"]';

    function normalize(label) {
        return (label || '').replace(/\s+/g, ' ').trim();
    }

    function labelsFor(element) {
        const labels = [
            element.getAttribute('aria-label'),
            element.getAttribute('title'),
            element.getAttribute('data-tooltip'),
        ];
        const labelledBy = element.getAttribute('aria-labelledby');
        if (labelledBy) {
            labels.push(labelledBy.trim().split(/\s+/).map((id) =>
                element.ownerDocument.getElementById(id)?.textContent || ''
            ).join(' '));
        }
        if (element.matches(controlSelector)) {
            labels.push(element.textContent);
        }
        return labels.map(normalize).filter(Boolean);
    }

    function isCompletionControl(element) {
        // Skip disabled controls and checkboxes that would reopen a task.
        if (element.closest('[disabled], [aria-disabled="true"]')) return false;
        const control = element.closest(controlSelector) || element;
        if (control.getAttribute('aria-checked') === 'true' || control.checked === true) {
            return false;
        }
        const labels = labelsFor(control);
        if (control !== element) labels.push(...labelsFor(element));
        if (labels.some((label) => reopeningLabel.test(label))) return false;
        return labels.some((label) => completionLabel.test(label));
    }

    // Delegation also covers controls inserted later by Asana's SPA.
    // Let the original event continue after confirmation: no synthetic click,
    // no direct API calls and no replacement of Asana's own task logic.
    window.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0) return;

        const completionControl = event.composedPath().find((element) =>
            element instanceof Element && isCompletionControl(element)
        );
        if (!completionControl) return;

        if (!window.confirm('Opravdu chceš označit tento úkol jako dokončený?')) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, { capture: true, passive: false });
})();

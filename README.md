# README

Set of custom scripts for `TemperMonkey`.

## Install as a User Script - Tampermonkey

Add https://tampermonkey.net/ into your browser

# Goldengate

Show buyout prices on product list

![alt text](https://github.com/lerix/goldengate-monkey/raw/main/coin.png "Coin")

Install User script from this URL:[goldengate.user.js](https://github.com/TomKalina/monkey-scripts/raw/main/goldengate.user.js)

# Fakturoid

Distribution of "price" attribute from url to invoice

Install User script from this URL:[fakturoid.user.js](https://github.com/TomKalina/monkey-scripts/raw/main/fakturoid.user.js)

# Asana

Ask for confirmation before clicking a recognized task completion control.
Cancel blocks the click; OK lets Asana handle the original event normally.

Install User script from this URL: [asana.user.js](https://github.com/TomKalina/monkey-scripts/raw/main/asana.user.js)

After installing, reload Asana. Each team member needs to install the script in
their own browser.

The script recognizes English and Czech completion action labels, including
accessible labels and button text. Event delegation also handles controls added
after navigation without reloading the page. Reopening a completed task does not
require confirmation.

## Scope and verification

- Runs only on `https://app.asana.com/*`; no external dependencies or network requests.
- Guards recognized `click` events only. Keyboard activation is covered only when
  it generates a click; Asana's direct completion shortcuts (such as Ctrl/Cmd+Enter),
  pointer-down handlers, API calls, mobile apps and desktop apps are not guarded.
- Controls without a recognized label, other interface languages and changes to
  Asana's markup may bypass the guard. This is a convenience guard, not a permission control.
- Event cancellation and label recognition were checked locally with DOM fixtures.
  The current live Asana interface has not been verified.

Before relying on it, use a disposable task to check both the row checkbox and
the task detail completion button: Cancel should leave the task incomplete and
OK should complete it once. If no prompt appears, inspect the control's HTML and
update its label matching in `asana.user.js`.

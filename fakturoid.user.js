// ==UserScript==
// @name         Fakturoid script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Distribution of "price" attribute from url to invoice
// @author       Tomas Kalina
// @match        https://app.fakturoid.cz/*
// @grant        none
// ==/UserScript==

(async function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const price = urlParams.get("price");
  if (price) {
    document.getElementById(
      "invoice_lines_attributes_0_unit_price_field"
    ).value = price;
  }
})();

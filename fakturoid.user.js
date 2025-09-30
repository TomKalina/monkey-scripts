// ==UserScript==
// @name         Fakturoid script
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Distribution of "price" attribute from url to invoice
// @author       Tomas Kalina
// @match        https://app.fakturoid.cz/*
// @require      file:///Users/tom/dev/monkey-scripts/fakturoid.user.js
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fakturoid.cz
// ==/UserScript==

console.log("Fakturoid script loaded");
let intervalID;
(async function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const price = urlParams.get("price");
  if (price) {
    const priceField = document.getElementById(
      "invoice_lines_attributes_0_unit_price_field"
    );
    const unitPriceField = document.getElementById("invoice_lines_attributes_0_unit_price");
    
    if (priceField) {
      priceField.value = price;
    }
    
    if (unitPriceField) {
      unitPriceField.value = price;
    }
  }

  intervalID = setInterval(setMessageSubject, 1000);
})();

function setMessageSubject() {
  const message_subject = document.getElementById("message_subject");
  if (message_subject && String(message_subject.value).includes("TODO")) {
    message_subject.value = `Faktura - ${getInvoiceMonth()} ${getInvoiceYear()}`;
    // clearInterval(intervalID);
  }
}

const now = new Date();
const prevMonth = new Date(
  now.getFullYear(),
  now.getMonth() - 1,
  now.getDate()
);

/**
 * 
 * @returns {number} Invoice year 
 */
function getInvoiceYear() {
  if (now.getDate() < 15) {
    return prevMonth.getFullYear();
  } else {
    return now.getFullYear();
  }
}

/**
 * 
 * @returns {string} Month name in Czech
 */
function getInvoiceMonth() {
  if (now.getDate() < 15) {
    return getCurrentMonth(prevMonth);
  } else {
    return getCurrentMonth(now);
  }
}

/**
 * 
 * @param Date date 
 * @returns {string} Month name in Czech
 */
function getCurrentMonth(date) {
  const monthNames = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
  ];

  return monthNames[date.getMonth()];
}

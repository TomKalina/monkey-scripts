// ==UserScript==
// @name         Fakturoid script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Distribution of "price" attribute from url to invoice
// @author       Tomas Kalina
// @match        https://app.fakturoid.cz/*
// @require      file:///Users/tom/dev/monkey-scripts/fakturoid.user.js
// @grant        none
// ==/UserScript==

console.log("Fakturoid script loaded");
let intervalID;
(async function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const price = urlParams.get("price");
  if (price) {
    document.getElementById(
      "invoice_lines_attributes_0_unit_price_field"
    ).value = price;

    document.getElementById("invoice_lines_attributes_0_unit_price").value =
      price;
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

function getInvoiceYear() {
  const now = new Date();
  const prevMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  if (now.getMonth() < 15) {
    return prevMonth.getFullYear();
  } else {
    return now.getFullYear();
  }
}

function getInvoiceMonth() {
  const now = new Date();
  const prevMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  console.log(now.getMonth());
  if (now.getDay() < 15) {
    return getCurrentMonth(now);
  } else {
    return getCurrentMonth(prevMonth);
  }
}

function getCurrentMonth(date) {
  console.log(date);
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

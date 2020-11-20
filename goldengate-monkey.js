// ==UserScript==
// @name         Goldengate moneky
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  some better goldengate
// @author       Tomas Kalina
// @match        https://moje.goldengate.cz/products*
// @grant        none
// @require https://cdn.rawgit.com/blowsie/Pure-JavaScript-HTML5-Parser/master/htmlparser.js
// @require https://cdn.jsdelivr.net/npm/html2json@1.0.2/src/html2json.js
// ==/UserScript==

(async function () {
    'use strict';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const url = "https://moje.goldengate.cz/buyout_prices?product_category_id=" + urlParams.get('product_category_id')
    let response = await fetch(url)
    let data = await response.text();
    let db = new Map()
    var json = html2json(data);
    var wtfList = json.child[0]["child"][3]["child"][3]["child"][1]["child"][3]["child"][5]["child"];
    Object.keys(wtfList).map(wtfKey => {
        const wtf = wtfList[wtfKey]
        if (wtf.node === "element") {
            let key = wtf["child"][3]["child"][1]["child"][0]["child"][0]["text"]
            let price = wtf["child"][5]["child"][1]["child"][1]["child"][1]["child"][0]["text"]
            db[key.replace(/\D/g, '')] = price;

        }
    })
    const coins = document.querySelectorAll(".product__name");
    coins.forEach((coin) => {
        const key = coin.getElementsByTagName("a")[0].outerText
        var t = document.createTextNode(db[key.replace(/\D/g, '')])
        coin.appendChild(t)
    })

})();


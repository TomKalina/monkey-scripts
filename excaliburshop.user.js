// ==UserScript==
// @name         excaliburshop script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Rating of whisky
// @author       Tomas Kalina
// @match        https://www.excaliburshop.com/*
// @require      file:///Users/tom/dev/monkey-scripts/excaliburshop.user.js
// @connect      api.distilld.io
// @connect      static.distilld.io
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(async function () {
  "use strict";

  console.log("excaliburshop script loaded");

  /**
   * @type {HTMLCollectionOf<Div>}
   */
  const items = document.getElementsByClassName("heading");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const data = await loadRequest(item.innerText);
    const rating = getRating(data);

    if (rating) {
      const ratingElement = document.createElement("div");
      let html = "";
      if (rating.rating > 0) {
        html = `${rating.rating}: ${getStarRating(rating.rating)}`;
      }

      if (rating.link) {
        html += `<a href="https://distilld.io/whisky/${rating.link}" target="_blank">distilld.io</a>`;

        const thumbnailLink = `https://static.distilld.io/thumbnail/${rating.thumbnail}.webp`;

        // Načtení obrázku pomocí Base64
        loadImage(thumbnailLink, ratingElement)
      }

      ratingElement.innerHTML = html;
      item.parentNode.insertBefore(ratingElement, item.nextSibling);
    }
  }
})();

/**
 * Extrahuje hodnocení ze získaných dat.
 * @param {*} data
 * @returns {{rating: string, link: string| undefined,thumbnail: string| undefined}| undefined} Hodnocení
 */
function getRating(data) {
  const id = data?.hits?.hits[0]?._id;
  const source = data?.hits?.hits[0]?._source;
  const average_rating = Number(source?.average_rating);

  if (source) {
    return { rating: average_rating.toFixed(1), link: source?.name_key && `${source?.name_key}-${id}`, thumbnail: source?.thumbnail };
  }
}

/**
 * Převádí číselné hodnocení na hvězdičkové hodnocení.
 * @param {number} rating Číselné hodnocení.
 * @returns {string} Hodnocení jako hvězdičky.
 */
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);
}

function loadImage(thumbnailLink, ratingElement) {
  GM_xmlhttpRequest({
    method: "GET",
    url: thumbnailLink,
    responseType: "arraybuffer",
    onload: function (response) {
      const base64Image = btoa(
        new Uint8Array(response.response).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const dataUrl = `data:image/webp;base64,${base64Image}`;

      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = dataUrl;
      thumbnailImage.style.display = "none";
      thumbnailImage.style.position = "absolute";
      thumbnailImage.style.zIndex = "1000";
      document.body.appendChild(thumbnailImage);

      ratingElement.addEventListener("mouseover", () => {
        thumbnailImage.style.display = "block";
        const rect = ratingElement.getBoundingClientRect();
        thumbnailImage.style.top = `${rect.top + window.scrollY + 50}px`;
        thumbnailImage.style.left = `${rect.right + window.scrollX - 200}px`;
      });

      ratingElement.addEventListener("mouseout", () => {
        thumbnailImage.style.display = "none";
      });
    },
    onerror: function (error) {
      console.error("Failed to load thumbnail:", error);
    },
  });
}

/**
 * Načítá hodnocení whisky ze vzdáleného API.
 * @param {string} name Název whisky
 * @returns {Promise<Object>} Data z API
 */
function loadRequest(name) {
  return new Promise((resolve, reject) => {
    const body = {
      searchQuery: name,
      tastingProfile: [],
      whiskyType: [],
      price: { values: ["0", "900+"] },
      country: [],
      region: [],
      rating: "",
      sort: "_score-desc",
      page: 1,
    };

    GM_xmlhttpRequest({
      method: "PUT",
      url: "https://api.distilld.io/search/filtered",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          resolve(data);
        } catch (error) {
          console.error("Error parsing response:", error);
          reject(error);
        }
      },
      onerror: function (error) {
        console.error("API request failed:", error);
        reject(error);
      },
    });
  });
}
// ==UserScript==
// @name         excaliburshop script
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Rating of whisky
// @author       Tomas Kalina
// @match        https://www.excaliburshop.com/*
// @require      file:///Users/tom/dev/monkey-scripts/excaliburshop.user.js
// @connect      api.whiskybase.com
// @connect      static.whiskybase.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(async function () {
  "use strict";

  console.log("excaliburshop script loaded");

  /**
   * @type {HTMLCollectionOf<HTMLDivElement>}
   */
  const items = document.getElementsByClassName("heading");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const betterName = makeBetterName(item.innerText);
    const data = await loadRequest(betterName);
    const bottle = getBottleBOject(data);

    const ratingElement = document.createElement("div");
    ratingElement.style.position = "absolute";
    ratingElement.style.zIndex = "1";
    let html = "Whiskybase";
    if (bottle) {
      if (bottle.rating > 0) {
        html += `: ${bottle.rating}`;
      }

      html += `<br/><a href="https://www.whiskybase.com/whiskies/whisky/${bottle.id}" target="_blank">detail</a>`;
      createDetail(ratingElement, data?.data[0]);
    }
    html += `<br/><a href="https://www.whiskybase.com/search-v1/?q=${betterName}" target="_blank">search (${data.total})</a>`;
    ratingElement.innerHTML = html;
    item.parentNode.insertBefore(ratingElement, item.parentNode.firstChild);
  }
})();

/**
 * Extrahuje hodnocení ze získaných dat.
 * @param {HttpResponse} data
 * @returns {DataView} Hodnocení
 */
function getBottleBOject(data) {
  if (data?.data.length === 0) {
    return undefined;
  }
  return data?.data[0];
}

/**
 *
 * @param {any} ratingElement
 * @param {string} name
 * @param {WhiskyData} data
 */
function createDetail(ratingElement, data) {
  const thumbnailLink = data?.photo?.normal;
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
      const detailDiv = document.createElement("div");
      detailDiv.style.display = "none";
      detailDiv.style.position = "absolute";
      detailDiv.style.zIndex = "1000";
      detailDiv.style.backgroundColor = "white";
      detailDiv.style.border = "1px solid black";

      const title = document.createElement("div");
      title.innerHTML = data?.suggest;
      detailDiv.appendChild(title);

      const image = document.createElement("img");
      image.src = dataUrl;
      detailDiv.appendChild(image);

      document.body.appendChild(detailDiv);

      ratingElement.addEventListener("mouseover", () => {
        detailDiv.style.display = "block";
        const rect = ratingElement.getBoundingClientRect();
        detailDiv.style.top = `${rect.top + window.scrollY + 80}px`;
        detailDiv.style.left = `${rect.right + window.scrollX - 200}px`;
      });

      ratingElement.addEventListener("mouseout", () => {
        detailDiv.style.display = "none";
      });
    },
    onerror: function (error) {
      console.error("Failed to load thumbnail:", error);
    },
  });
}

/**
 *
 * @param {string} name
 * @returns {string}
 */
function makeBetterName(name) {
  const nameArray = name.split(" ");

  let betterName = nameArray
    .filter(
      (word) => word.length >= 3 && !/\d/.test(word) && !/[áí%]/i.test(word)
    )
    .join(" ");
  const yaerOld = nameArray.find((word) => /\b(\d{1,2})Y\b/g.test(word));
  if (yaerOld) {
    betterName += " " + yaerOld.replace(/\b(\d{1,2})Y\b/g, "$1-year-old");
  }

  const size = name.split(" ").find((word) => /\b(\d{1,2})L\b/g.test(word));
  if (size) {
    betterName += " " + size.replace(/\b(\d{1,2})L\b/g, "$1L");
  }

  console.log("name:", name, "betterName:", betterName);

  return betterName;
}

/**
 * Načítá hodnocení whisky ze vzdáleného API.
 * @param {string} name Název whisky
 * @returns {Promise<HttpResponse>} Data z API
 */
function loadRequest(name) {
  return new Promise((resolve, reject) => {
    const body = {
      query: name,
      perpage: 20,
      page: 1,
    };

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.whiskybase.com/api/v1/search",
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

/**
 * HTTP Response
 * @typedef {Object} HttpResponse
 * @property {boolean} success - Indicates if the request was successful.
 * @property {number} current_page - The current page number in pagination.
 * @property {number} from - The starting item number of the current page.
 * @property {number} to - The ending item number of the current page.
 * @property {number} total - Total number of items available.
 * @property {number} per_page - Number of items per page.
 * @property {number} last_page - Total number of pages.
 * @property {string} path - API endpoint for the search.
 * @property {string} first_page_url - URL for the first page.
 * @property {string} last_page_url - URL for the last page.
 * @property {string|null} next_page_url - URL for the next page, or null if it doesn't exist.
 * @property {string|null} prev_page_url - URL for the previous page, or null if it doesn't exist.
 * @property {Array<WhiskyData>} data - List of whisky items on the current page.
 * @property {Array<number>} years - List of years related to the items.
 * @property {Array<number>} bottled - List of bottled years.
 * @property {Array<string>} strength - List of strength percentages.
 * @property {Array<string>} casknumbers - List of cask numbers.
 */

/**
 * Whisky data
 * @typedef {Object} WhiskyData
 * @property {number} id - Unique ID of the whisky.
 * @property {string} brandname - Brand name of the whisky.
 * @property {string} name - Name of the whisky.
 * @property {string|null} bottle_code - Bottle code, if available.
 * @property {string} barcode - Barcode of the whisky.
 * @property {string|null} cask_number - Cask number, if available.
 * @property {number|null} vintage_year - Year of vintage, if available.
 * @property {string} strength_unit - Unit of strength, typically "%vol".
 * @property {string} strength - Strength of the whisky.
 * @property {string} rating - Rating of the whisky.
 * @property {number} bottle_date_year - Year the bottle was dated.
 * @property {string|null} otherreleases - Other releases, if available.
 * @property {string} bottler - Bottler information.
 * @property {number} age - Age of the whisky.
 * @property {string} whisky_type - Type of the whisky (e.g., Single Malt).
 * @property {number|null} itemsforsale - Number of items for sale, if available.
 * @property {number} bottle_size - Size of the bottle in milliliters.
 * @property {string} country_code - Country code of the whisky's origin.
 * @property {string} country_name - Country name of the whisky's origin.
 * @property {string} region_name - Region name where the whisky is produced.
 * @property {string} serie - Series name, if available.
 * @property {string} bottle_for - Information about the intended market (e.g., "Travel Exclusive").
 * @property {string} bottle_date - Date of the bottle.
 * @property {string} suggest - Suggested name for the whisky.
 * @property {string} suggest_brand - Suggested brand name.
 * @property {Photo} photo - Photo URLs for the whisky.
 */

/**
 * Photo data
 * @typedef {Object} Photo
 * @property {number} id - Photo ID.
 * @property {string} small - URL for the small photo.
 * @property {string} normal - URL for the normal photo.
 * @property {string} big - URL for the big photo.
 */

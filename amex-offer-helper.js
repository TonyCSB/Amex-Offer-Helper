// ==UserScript==
// @name         Amex Offer Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Helps you add American Express Offer easily
// @author       Tony Chen
// @include      https://global.americanexpress.com/offers/eligible
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL
// ==/UserScript==


// Check element credit:
// https://stackoverflow.com/a/47776379
function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
}

async function checkElement(selector) {
    let querySelector = null;
    while (querySelector === null) {
        await rafAsync();
        querySelector = document.querySelector(selector);
    }
    return querySelector;
}

let addAllBtn = document.createElement("a");
let TIMEOUT = 2000;

async function addAllOffers() {
    let checked = document.querySelectorAll("input[name='offers_checkbox']:checked");
    let btns;
    var index;
    if (checked.length == 0) {
        btns = [...document.querySelectorAll(".btn.btn-sm.btn-fluid.offer-cta.btn-secondary")].filter(btn => btn.title == "Add to Card");

        index = 0;
        for (;index < btns.length; index++) {
            btns[index].click();
            await new Promise(r => setTimeout(r, TIMEOUT));
        }
    } else {
        index = 0;
        for(;index< checked.length; index++) {
            checked[index].parentElement.parentElement.querySelector(".btn").click();
            await new Promise(r => setTimeout(r, TIMEOUT));
        }
    }
    addAllBtn.textContent = "Add All Offers";
}

function addCheckbox() {
    let rows = [...document.querySelectorAll(".card-block.border-b, .card-block.border-0-b")].filter(r => r.querySelector(".btn.btn-sm.btn-fluid.offer-cta.btn-secondary").title == "Add to Card");
    rows.forEach((offer, idx) => {
        let name = "user_select_offer_" + idx;
        let row = offer.querySelector(".row");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = name;
        checkbox.name = "offers_checkbox";
        checkbox.value = name;
        checkbox.addEventListener("click", e => {
            if (document.querySelectorAll("input[name='offers_checkbox']:checked").length == 0) {
                addAllBtn.textContent = "Add All Offers";
            } else {
                addAllBtn.textContent = "Add Selected Offers (" + document.querySelectorAll("input[name='offers_checkbox']:checked").length + ")";
            }
            e.stopPropagation()
        });
        let div = document.createElement("div");
        div.classList = "col-0";
        div.appendChild(checkbox);
        row.prepend(div);
    });
}

(function() {
    'use strict';

    checkElement("#offers > div span").then(title => {
        addAllBtn.classList = "btn-secondary btn btn-fluid";
        addAllBtn.textContent = "Add All Offers";
        addAllBtn.style.width = "auto";
        addAllBtn.addEventListener("click", addAllOffers)
        title.appendChild(addAllBtn);

        checkElement(".card-block.border-b").then(_ => {
            addCheckbox();
        });
    });
})();

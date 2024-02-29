/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
let map, overview;
const OVERVIEW_DIFFERENCE = 0;
const OVERVIEW_MIN_ZOOM = 15;
const OVERVIEW_MAX_ZOOM = 20;

const btn_update = document.getElementById("btn_update");
const w_input = document.getElementById("w_input");
const h_input = document.getElementById("h_input");
const w = document.getElementById("cur_width");
const h = document.getElementById("cur_height");

btn_update.addEventListener("click", () => {
  w.innerText = w_input.value;
  h.innerText = h_input.value;
  w_input.value = "";
  h_input.value = "";
  initOverview();
});

class CoordMapType {
  tileSize;
  alt = null;
  maxZoom = 17;
  minZoom = 10;
  name = null;
  projection = null;
  radius = 6378137;
  constructor(tileSize) {
    this.tileSize = tileSize;
  }
  getTile(coord, zoom, ownerDocument) {
    const div = ownerDocument.createElement("div");

    // div.innerHTML = String(coord) + String(this.tileSize.width);
    div.style.width = this.tileSize.width + "px";
    div.style.height = this.tileSize.height + "px";
    div.style.fontSize = "10";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1.5px";
    div.style.borderColor = "#AAAAAA";
    return div;
  }
  releaseTile(tile) {}
}

function initMap() {
  const mapOptions = {
    center: { lat: 50, lng: 8 },
    zoom: 15,
    maxZoom: 17,
    minZoom: 10,
  };

  // instantiate the primary map
  map = new google.maps.Map(document.getElementById("map"), {
    ...mapOptions,
  });

  // instantiate the overview map without controls
  overview = new google.maps.Map(document.getElementById("overview"), {
    ...mapOptions,
    disableDefaultUI: true,
    gestureHandling: "none",
    zoomControl: false,
  });

  initOverview();

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  map.addListener("bounds_changed", () => {
    overview.setCenter(map.getCenter());
    overview.setZoom(
      clamp(
        map.getZoom() - OVERVIEW_DIFFERENCE,
        OVERVIEW_MIN_ZOOM,
        OVERVIEW_MAX_ZOOM
      )
    );
  });
}

function initOverview() {
  const coordMapType = new CoordMapType(
    new google.maps.Size(parseInt(w.innerText), parseInt(h.innerText))
  );

  overview.overlayMapTypes.pop();
  overview.overlayMapTypes.insertAt(0, coordMapType);
  console.log(overview.overlayMapTypes);
}

window.initMap = initMap;

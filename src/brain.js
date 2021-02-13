require("lodash");
require("leaflet");
require("leaflet-providers");
const axios = require('axios').default;

const updatCounter = (response) => {
    let target = response.data.signatures,
      timeslice = target / 2000,
      spacing = String(target).length,
      counter = 0,
      previous = -1,
      badge = document.querySelector('.badge');
    const doCount = (t) => {
      if (previous < 0)
        previous = t;
      let steps = (t - previous);
      counter += steps * timeslice;
      previous = t;
      let value = Math.min(Math.round(counter), target),
        pad = "0".repeat(spacing - String(value).length);
      badge.innerText = pad + value;
      if (counter < target)
        window.requestAnimationFrame(doCount);
    }
    window.requestAnimationFrame(doCount);
  }

const updateSignatures = (response) => {
    let target = _.uniqWith(response.data.signatures, ["Nome", "Cognome"], _.isEqual),
      list = document.getElementById("signatures"),
      bottom = document.getElementById("bottom-viewport"),
      options = {
        rootMargin: '60px',
      },
      // i'm on a CAAAAALLLBAAAACK TO HEEEELL
      observer = new IntersectionObserver((entries, observer) => {
        try {
          for (let entry of entries) {
            if(!entry.isIntersecting) continue;
            if(target.length == 0) continue;
            target.splice(0, 32).forEach((el) => {
              window.requestAnimationFrame(() => {
                let li = document.createElement("li");
                li.innerText = el["Nome"] + " " + el["Cognome"];
                list.appendChild(li);
              });
            })
          }
        } catch(e) {
            console.log(e)
        };
      },
        options);
    observer.observe(bottom);
  }
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow
});

axios.get("/src/count.json")
  .then(updatCounter)
axios.get("/src/signatures.json").then(updateSignatures);

let mymap = L.map('map').setView([43.71661,10.39750], 17);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);
L.marker([43.71661,10.39750]).addTo(mymap)

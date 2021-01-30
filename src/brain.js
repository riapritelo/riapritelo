require("lodash");
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
        for (entry of entries) {
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
      },
        options);
    observer.observe(bottom);
  }

axios.get("/src/count.json")
  .then(updatCounter)
axios.get("/src/signatures.json").then(updateSignatures);

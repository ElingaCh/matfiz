// Matfizo pratybos: sprendimų atidengimas po žingsnį ir „Išspręsta“ žymės.
(function () {
  var RAKTAS = "matfiz-isspresta";
  function skaityti() {
    try { return JSON.parse(localStorage.getItem(RAKTAS) || "{}") || {}; } catch (e) { return {}; }
  }
  function rasyti(b) {
    try { localStorage.setItem(RAKTAS, JSON.stringify(b)); } catch (e) {}
  }
  var busena = skaityti();

  function issprestaTemoje(tema) {
    var n = 0;
    Object.keys(busena).forEach(function (k) {
      if (busena[k] && k.split(".")[0] === String(tema)) n++;
    });
    return n;
  }
  function pilnumas(el, dalis, visa) {
    if (el) el.style.width = (visa ? Math.round(100 * dalis / visa) : 0) + "%";
  }

  // ---------- Titulinis puslapis ----------
  if (document.body.classList.contains("titulinis")) {
    var viso = 0, pirmaNebaigta = null;
    document.querySelectorAll(".kortele").forEach(function (k) {
      var tema = k.dataset.tema, visos = +k.dataset.uzduociu;
      var ats = Math.min(issprestaTemoje(tema), visos);
      viso += ats;
      pilnumas(k.querySelector(".juosta-uzpildas"), ats, visos);
      k.querySelector(".kortele-progresas").textContent = ats + " iš " + visos + " išspręsta";
      k.classList.toggle("baigta", ats === visos);
      if (pirmaNebaigta === null && ats < visos) pirmaNebaigta = k;
    });
    document.getElementById("bendras-sk").textContent = viso;
    pilnumas(document.getElementById("bendras-juosta"), viso, +document.body.dataset.uzduociu);
    var testi = document.getElementById("testi");
    if (viso > 0 && pirmaNebaigta) {
      testi.href = pirmaNebaigta.getAttribute("href");
      testi.textContent = "Tęsti: " + pirmaNebaigta.dataset.tema + " tema";
    }
    return;
  }

  // ---------- Temos puslapis ----------
  document.querySelectorAll(".sprendimas").forEach(function (spr) {
    var dalys = Array.prototype.slice.call(spr.children);
    var rodoma = 0;
    var valdymas = document.createElement("div");
    valdymas.className = "valdymas";
    var kitas = document.createElement("button");
    kitas.className = "pagrindinis";
    var visas = document.createElement("button");
    visas.textContent = "Rodyti visą sprendimą";
    var slepti = document.createElement("button");
    slepti.textContent = "Slėpti";
    valdymas.append(kitas, visas, slepti);
    spr.prepend(valdymas);
    spr.classList.add("paslepta");

    function atnaujinti() {
      dalys.forEach(function (d, i) { d.classList.toggle("rodomas", i < rodoma); });
      kitas.textContent = rodoma === 0 ? "Rodyti sprendimą (1 žingsnis)" : "Rodyti kitą žingsnį";
      kitas.style.display = rodoma < dalys.length ? "" : "none";
      visas.style.display = rodoma < dalys.length ? "" : "none";
      slepti.style.display = rodoma > 0 ? "" : "none";
      spr.classList.toggle("atidengta", rodoma > 0);
    }
    kitas.onclick = function () {
      rodoma++;
      while (rodoma < dalys.length && !dalys[rodoma - 1].textContent.trim()) rodoma++;
      atnaujinti();
      var naujas = dalys[rodoma - 1];
      if (naujas && naujas.getBoundingClientRect().bottom > window.innerHeight) {
        naujas.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };
    visas.onclick = function () { rodoma = dalys.length; atnaujinti(); };
    slepti.onclick = function () { rodoma = 0; atnaujinti(); };
    atnaujinti();
  });

  var tema = document.body.dataset.tema;
  var visos = document.querySelectorAll(".uzduotis").length;
  function progresas() {
    var ats = document.querySelectorAll(".uzduotis.atlikta").length;
    var p = document.querySelector(".temos-progresas");
    if (p) p.textContent = "Išspręsta " + ats + " iš " + visos;
    pilnumas(document.querySelector(".hero .juosta-uzpildas"), ats, visos);
  }
  document.querySelectorAll(".uzduotis").forEach(function (u) {
    var nr = u.dataset.nr;
    var l = document.createElement("label");
    l.className = "isspresta";
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!busena[nr];
    u.classList.toggle("atlikta", cb.checked);
    cb.onchange = function () {
      busena = skaityti();
      busena[nr] = cb.checked; rasyti(busena);
      u.classList.toggle("atlikta", cb.checked); progresas();
    };
    l.append(cb, document.createTextNode("Išspręsta"));
    u.insertBefore(l, u.querySelector(".sprendimas"));
  });
  progresas();

  // Paryškiname aktyvią temos dalį viršutinėje juostoje
  var nuorodos = document.querySelectorAll(".skyreliai a");
  var tikslai = Array.prototype.map.call(nuorodos, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function aktyvi() {
    var y = window.scrollY + 140, idx = -1;
    tikslai.forEach(function (t, i) { if (t && t.offsetTop <= y) idx = i; });
    nuorodos.forEach(function (a, i) { a.classList.toggle("aktyvi", i === idx); });
  }
  window.addEventListener("scroll", aktyvi, { passive: true });
  aktyvi();
})();

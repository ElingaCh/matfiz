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

  // „Nepavyko“ žymės laikomos atskirai, kad nepakeistume „Išspręsta“ duomenų
  var RAKTAS_N = "matfiz-nepavyko";
  function skaitytiN() {
    try { return JSON.parse(localStorage.getItem(RAKTAS_N) || "{}") || {}; } catch (e) { return {}; }
  }
  function rasytiN(b) {
    try { localStorage.setItem(RAKTAS_N, JSON.stringify(b)); } catch (e) {}
  }
  var nepavyko = skaitytiN();
  function nepavykoTemoje(tema) {
    var n = 0;
    Object.keys(nepavyko).forEach(function (k) {
      if (nepavyko[k] && k.split(".")[0] === String(tema)) n++;
    });
    return n;
  }

  // Šoninė juosta: progresas ir atidarymas mažame ekrane
  document.querySelectorAll(".sonine-temos a").forEach(function (a) {
    var visos = +a.dataset.uzduociu, ats = Math.min(issprestaTemoje(a.dataset.tema), visos);
    var p = a.querySelector(".st-prog");
    if (p) p.textContent = ats ? ats + "/" + visos : "";
    a.classList.toggle("baigta", ats === visos && visos > 0);
  });
  var sonine = document.getElementById("sonine");
  var meniu = document.querySelector(".meniu");
  var uzdanga = document.querySelector(".sonine-uzdanga");
  function rodytiSonine(rodyti) {
    if (!sonine) return;
    document.body.classList.toggle("sonine-atidaryta", rodyti);
    if (uzdanga) uzdanga.hidden = !rodyti;
    if (meniu) meniu.setAttribute("aria-expanded", rodyti ? "true" : "false");
  }
  if (meniu) meniu.onclick = function () { rodytiSonine(!document.body.classList.contains("sonine-atidaryta")); };
  if (uzdanga) uzdanga.onclick = function () { rodytiSonine(false); };
  var uzd = document.querySelector(".sonine-uzdaryti");
  if (uzd) uzd.onclick = function () { rodytiSonine(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") rodytiSonine(false); });
  var dabartine = document.querySelector(".sonine a.aktyvi");
  if (dabartine && sonine) sonine.scrollTop = Math.max(0, dabartine.offsetTop - sonine.clientHeight / 2);

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
      var nep = nepavykoTemoje(tema), np = k.querySelector(".kortele-nepavyko");
      if (np) np.textContent = nep ? "Nepavyko: " + nep : "";
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
    var zymes = document.createElement("div");
    zymes.className = "zymes";
    var l = document.createElement("label");
    l.className = "isspresta";
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!busena[nr];
    u.classList.toggle("atlikta", cb.checked);

    var ln = document.createElement("label");
    ln.className = "nepavyko-zyme";
    var cbn = document.createElement("input");
    cbn.type = "checkbox";
    cbn.checked = !!nepavyko[nr] && !cb.checked;
    u.classList.toggle("nepavyko", cbn.checked);

    var spr = u.querySelector(".sprendimas");
    var juokas = document.createElement("div");
    juokas.className = "nejuokaukit";
    juokas.setAttribute("role", "status");
    juokas.innerHTML = "<strong>Nejuokaukit!</strong><span>Atidenk sprendimą po vieną žingsnį ir pabandyk dar kartą.</span>";
    juokas.hidden = !cbn.checked;

    function issaugoti() {
      busena = skaityti(); nepavyko = skaitytiN();
      busena[nr] = cb.checked; nepavyko[nr] = cbn.checked;
      rasyti(busena); rasytiN(nepavyko);
      u.classList.toggle("atlikta", cb.checked);
      u.classList.toggle("nepavyko", cbn.checked);
      juokas.hidden = !cbn.checked;
      progresas();
    }
    cb.onchange = function () { if (cb.checked) cbn.checked = false; issaugoti(); };
    cbn.onchange = function () { if (cbn.checked) cb.checked = false; issaugoti(); };

    l.append(cb, document.createTextNode("Išspręsta"));
    ln.append(cbn, document.createTextNode("Nepavyko"));
    zymes.append(l, ln);
    u.insertBefore(zymes, spr);
    if (spr) spr.insertBefore(juokas, spr.firstChild);
    else u.appendChild(juokas);
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

// ====== CONFIGURACIÓN ======
// Cambia esta fecha por el día en que empezaron (año, mes-1, día)
const FECHA_INICIO = new Date(2026, 6, 22); // 22 de julio de 2026 (07/22/26)

const FRASES = [
  "Eres mi lugar favorito ♡",
  "Gracias por estos 3 meses ✿",
  "Contigo todo es más bonito ✧"
];

const RAZONES = [
  "Porque me haces reír incluso en mis peores días ♡",
  "Porque contigo puedo ser yo mismo ✿",
  "Porque aunque estemos lejos, te siento cerca ♡",
  "Porque me escuchas como nadie ✧",
  "Porque haces que lo simple sea especial ✧",
  "Porque pienso en ti al despertar ✿",
  "Porque tu voz es mi canción favorita ♡",
  "Porque me inspiras a ser mejor ✧",
  "Porque eres mi persona favorita ♡",
  "Porque cada día contigo es un regalo ✿"
];


// ====== MÚSICA DE FONDO ======
const MUSICA = {
  archivo: "audio/stand-by-me.mp3",
  volumen: 0.2,   // volumen de fondo (0 = mudo, 1 = máximo)
  fadeMs: 2500    // duración del fade-in / fade-out en milisegundos
};
const ICONOS = ["heart", "heart", "heart", "heart", "sakura", "sparkle", "bow"];
const COLORES_ICONO = ["#ff8fab", "#fb6f92", "#ffb3c9", "#ffc8dd", "#cdb4db", "#f7a8c4"];
function iconoAleatorio() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "ic");
  const use = document.createElementNS(ns, "use");
  use.setAttribute("href", "#i-" + ICONOS[Math.floor(Math.random() * ICONOS.length)]);
  svg.appendChild(use);
  svg.style.color = COLORES_ICONO[Math.floor(Math.random() * COLORES_ICONO.length)];
  return svg;
}

// ====== CORAZONES DE FONDO ======
const heartsBg = document.getElementById("hearts-bg");
function crearCorazon() {
  const h = document.createElement("span");
  h.className = "float-heart";
  h.appendChild(iconoAleatorio());
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 26 + "px";
  const dur = 7 + Math.random() * 8;
  h.style.animationDuration = dur + "s";
  heartsBg.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}
setInterval(crearCorazon, 500);

// ====== CORAZONES AL TOCAR ======
document.addEventListener("click", (e) => {
  for (let i = 0; i < 6; i++) {
    const h = document.createElement("span");
    h.className = "click-heart";
    h.appendChild(iconoAleatorio());
    h.style.left = e.clientX + "px";
    h.style.top = e.clientY + "px";
    const ang = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    h.style.setProperty("--x", Math.cos(ang) * dist + "px");
    h.style.setProperty("--y", Math.sin(ang) * dist + "px");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
});

// ====== CONFETI ======
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let piezas = [];
const COLORES = ["#ffc8dd", "#ff8fab", "#cdb4db", "#bde0fe", "#caffbf", "#ffd6a5", "#fdffb6"];

function ajustarCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", ajustarCanvas);
ajustarCanvas();

function lanzarConfeti(cant) {
  for (let i = 0; i < cant; i++) {
    piezas.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -16 - 4,
      size: 6 + Math.random() * 8,
      color: COLORES[Math.floor(Math.random() * COLORES.length)],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      heart: Math.random() < 0.3,
      vida: 0
    });
  }
  if (piezas.length === cant) requestAnimationFrame(animarConfeti);
}

function dibujarCorazon(s) {
  ctx.beginPath();
  ctx.moveTo(0, s / 4);
  ctx.bezierCurveTo(0, -s / 4, -s, -s / 4, -s, s / 4);
  ctx.bezierCurveTo(-s, s * 0.7, 0, s, 0, s * 1.2);
  ctx.bezierCurveTo(0, s, s, s * 0.7, s, s / 4);
  ctx.bezierCurveTo(s, -s / 4, 0, -s / 4, 0, s / 4);
  ctx.fill();
}

function animarConfeti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  piezas.forEach((p) => {
    p.vy += 0.35; p.vx *= 0.99;
    p.x += p.vx; p.y += p.vy;
    p.rot += p.vr; p.vida++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    if (p.heart) dibujarCorazon(p.size / 1.5);
    else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  });
  piezas = piezas.filter((p) => p.y < canvas.height + 40 && p.vida < 400);
  if (piezas.length) requestAnimationFrame(animarConfeti);
  else ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ====== MÚSICA DE FONDO (Stand By Me) ======
// Usa el archivo de assets/audio y el volumen definido en js/config.js
const cancion = new Audio(MUSICA.archivo);
cancion.loop = true;
cancion.preload = "auto";
cancion.volume = 0;

const btnMusica = document.getElementById("music-btn");
let musicaOn = false;
let pausadaPorPestana = false;
let fadeTimer = null;

function fadeA(objetivo, alTerminar) {
  clearInterval(fadeTimer);
  const pasos = 25;
  const inicio = cancion.volume;
  const delta = (objetivo - inicio) / pasos;
  let i = 0;
  fadeTimer = setInterval(() => {
    i++;
    cancion.volume = Math.min(1, Math.max(0, inicio + delta * i));
    if (i >= pasos) {
      clearInterval(fadeTimer);
      cancion.volume = objetivo;
      if (alTerminar) alTerminar();
    }
  }, MUSICA.fadeMs / pasos);
}

// Si el mp3 no carga (por ejemplo, no se subió al repo), avisa en la consola
cancion.addEventListener("error", () => {
  console.warn("No se pudo cargar la música: " + MUSICA.archivo);
});

// iPhone/Safari solo deja reproducir audio si play() ocurre justo al tocar.
// Se arranca en silencio al tocar el sobre y luego iniciarMusica() le da volumen.
function desbloquearAudio() {
  cancion.muted = true;
  const intento = cancion.play();
  if (intento && intento.catch) intento.catch(() => {});
}

function iniciarMusica() {
  cancion.muted = false;
  const intento = cancion.play();
  if (intento && intento.then) {
    intento.then(() => {
      musicaOn = true;
      btnMusica.classList.add("playing");
      fadeA(MUSICA.volumen);
    }).catch(() => { /* el navegador bloqueó el audio: se activa con el botón */ });
  }
}

function pausarMusica() {
  musicaOn = false;
  btnMusica.classList.remove("playing");
  fadeA(0, () => cancion.pause());
}

btnMusica.addEventListener("click", (e) => {
  e.stopPropagation();
  musicaOn ? pausarMusica() : iniciarMusica();
});

// Pausa la música si cambian de pestaña y la retoma al volver
document.addEventListener("visibilitychange", () => {
  if (document.hidden && musicaOn) {
    pausadaPorPestana = true;
    clearInterval(fadeTimer);
    cancion.pause();
  } else if (!document.hidden && pausadaPorPestana) {
    pausadaPorPestana = false;
    cancion.play().then(() => fadeA(MUSICA.volumen)).catch(() => {});
  }
});
// ====== ENTRADA (SOBRE) ======
const envelope = document.getElementById("envelope");
const intro = document.getElementById("intro");
const main = document.getElementById("main");
const musicBtn = document.getElementById("music-btn");

envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  desbloquearAudio();
  setTimeout(() => {
    lanzarConfeti(150);
    intro.classList.add("leave");
  }, 1500);
  setTimeout(() => {
    intro.remove();
    main.classList.remove("hidden");
    musicBtn.classList.remove("hidden");
    iniciarMusica();
    observar();
    escribir();
    setInterval(actualizarContador, 1000);
    actualizarContador();
  }, 2400);
});

// ====== TEXTO QUE SE ESCRIBE ======
const typed = document.getElementById("typed");
let fi = 0, ci = 0, borrando = false;
function escribir() {
  const frase = FRASES[fi];
  typed.textContent = frase.slice(0, ci);
  if (!borrando && ci < frase.length) { ci++; setTimeout(escribir, 80); }
  else if (!borrando) { borrando = true; setTimeout(escribir, 1800); }
  else if (ci > 0) { ci--; setTimeout(escribir, 40); }
  else { borrando = false; fi = (fi + 1) % FRASES.length; setTimeout(escribir, 400); }
}

// ====== CONTADOR ======
function actualizarContador() {
  const diff = Math.max(0, Date.now() - FECHA_INICIO.getTime());
  document.getElementById("c-days").textContent = Math.floor(diff / 86400000);
  document.getElementById("c-hours").textContent = Math.floor(diff / 3600000 % 24);
  document.getElementById("c-mins").textContent = Math.floor(diff / 60000 % 60);
  document.getElementById("c-secs").textContent = Math.floor(diff / 1000 % 60);
}

// ====== APARICIÓN AL HACER SCROLL ======
let finalLanzado = false;
function observar() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add("show"), i * 120);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -40px 0px" }); // threshold 0: elementos muy altos (la carta) también aparecen en el celular
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const finalSec = document.getElementById("final");
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !finalLanzado) {
      finalLanzado = true;
      finalSec.classList.add("play");
      lanzarConfeti(250);
    }
  }, { threshold: 0.5 }).observe(finalSec);
}

// ====== TARJETAS ======
document.querySelectorAll(".flip").forEach((c) =>
  c.addEventListener("click", () => c.classList.toggle("flipped"))
);

// ====== RAZONES ======
const reasonEl = document.getElementById("reason");
let ultima = -1;
document.getElementById("reason-btn").addEventListener("click", () => {
  let n;
  do { n = Math.floor(Math.random() * RAZONES.length); } while (n === ultima);
  ultima = n;
  reasonEl.classList.add("swap");
  setTimeout(() => {
    reasonEl.textContent = RAZONES[n];
    reasonEl.classList.remove("swap");
  }, 300);
});

// ====== REPETIR FINAL ======
document.getElementById("replay").addEventListener("click", () => {
  const f = document.getElementById("final");
  f.classList.remove("play");
  void f.offsetWidth; // reinicia animación
  f.classList.add("play");
  lanzarConfeti(250);
});


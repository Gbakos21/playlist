// ======= Alap adatok – IDE tedd a saját zenéid útvonalát =======
const playlist = [
  {
    title: "Demo Track 1",
    artist: "Demo Artist",
    src: "audio/demo1.mp3",
    cover: "test.jpg",
  },
  {
    title: "Demo Track 2",
    artist: "Another Artist",
    src: "audio/demo2.mp3",
    cover: "test.jpg",
  },
  {
    title: "Demo Track 3",
    artist: "Someone",
    src: "audio/demo3.mp3",
    cover: "test.jpg",
  },
];

let currentIndex = 0;

// ======= DOM elemek =======
const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playButton");
const prevBtn = document.getElementById("beforeButton");
const nextBtn = document.getElementById("afterButton");
const muteBtn = document.getElementById("muteButton");

const playIcon = document.getElementById("playIcon");
const volumeIcon = document.getElementById("volumeIcon");

const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const titleEl = document.getElementById("trackTitle");
const artistEl = document.getElementById("trackArtist");
const extraEl = document.getElementById("trackExtra");
const coverEl = document.querySelector(".image.cover");

const trackList = document.getElementById("trackList");

// ======= Segédfüggvények =======
function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function setIconPause(isPause) {
  if (!playIcon) return;
  if (isPause) {
    // Pause ikon
    playIcon.setAttribute("viewBox", "0 0 512 512");
    playIcon.innerHTML =
      '<path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM192 160c17.7 0 32 14.3 32 32V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32zm160 0c17.7 0 32 14.3 32 32V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32z"/>';
  } else {
    // Play ikon
    playIcon.setAttribute("viewBox", "0 0 512 512");
    playIcon.innerHTML =
      '<path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/>';
  }
}

function setVolumeIcon(muted) {
  if (!volumeIcon) return;
  volumeIcon.setAttribute("viewBox", "0 0 640 512");
  volumeIcon.innerHTML = muted
    ? '<path d="M216 128L104 208H24C10.7 208 0 218.7 0 232V280c0 13.3 10.7 24 24 24H104l112 80c21.2 15.1 40 2.7 40-18.8V146.8c0-21.6-18.8-33.9-40-18.8zM633.8 458.1L23.8 12.1C14.5 5 1.5 7.1-5.6 16.4s-5.1 23 4.2 30.1l610 446c9.3 7.1 22.3 4.9 29.4-4.4s5.1-23-4.2-30.1z"/>' // “muted” piktogram (áthúzva)
    : '<path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM400 256c0-25.1-10.7-47.7-27.7-63.5-10.3-9.6 10.9-32.1 21.1-22.5C419.2 190.8 432 222.1 432 256s-12.8 65.2-38.6 86c-10.3 8.4-31.4-13-21.1-21.4C389.3 303.7 400 281.1 400 256zM496 256c0-47.9-23-90.4-58.3-116.8-10.4-7.7 10.1-32.5 20.5-24.8C504.9 145.3 528 197.9 528 256s-23.1 110.7-69.7 141.6c-10.4 7.1-31-16.7-20.6-23.9C472.9 346.3 496 303.9 496 256z"/>';
}

// Track betöltése
function loadTrack(index) {
  currentIndex = (index + playlist.length) % playlist.length;
  const tr = playlist[currentIndex];
  audio.src = tr.src;
  titleEl.textContent = tr.title;
  artistEl.textContent = tr.artist;
  extraEl.textContent = `Sorszám: ${currentIndex + 1} / ${playlist.length}`;
  if (tr.cover) coverEl.src = tr.cover;
  setIconPause(false);
  // Preload meta hogy látszódjon az idő
  audio.load();
}

// Lejátszás / szünet
async function togglePlay() {
  if (audio.paused) {
    try {
      await audio.play();
      setIconPause(true);
    } catch (e) {
      console.warn("Nem sikerült lejátszani:", e);
    }
  } else {
    audio.pause();
    setIconPause(false);
  }
}

function prevTrack() {
  loadTrack(currentIndex - 1);
  audio.play().then(() => setIconPause(true));
}
function nextTrack() {
  loadTrack(currentIndex + 1);
  audio.play().then(() => setIconPause(true));
}

function toggleMute() {
  audio.muted = !audio.muted;
  setVolumeIcon(audio.muted);
}

// Tracklista kirajzolása
function renderTrackList() {
  trackList.innerHTML = "";
  playlist.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = "track-item";
    item.innerHTML = `
      <img class="thumb" src="${t.cover || "test.jpg"}" alt="">
      <div class="meta">
        <div class="t">${t.title}</div>
        <div class="a">${t.artist}</div>
      </div>
    `;
    item.addEventListener("click", () => {
      loadTrack(i);
      audio.play().then(() => setIconPause(true));
    });
    trackList.appendChild(item);
  });
}

// Idő/seek frissítés
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  seekBar.max = audio.duration || 0;
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (!isNaN(audio.duration)) {
    seekBar.value = audio.currentTime;
  }
});

seekBar.addEventListener("input", () => {
  if (!isNaN(audio.duration)) {
    audio.currentTime = Number(seekBar.value);
  }
});

// Ha vége a dalnak: következő
audio.addEventListener("ended", nextTrack);

// Gombok eseményei
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);
muteBtn.addEventListener("click", toggleMute);

// Init
renderTrackList();
loadTrack(0);
setVolumeIcon(false);

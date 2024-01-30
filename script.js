// script.js
var id = 1;
var currentAudio = null;
var audioList = [];  // Tömb az audio elemek tárolásához
var currentAudioIndex = -1;  // Az aktuálisan lejátszott audio indexe

document.addEventListener("DOMContentLoaded", function () {
    //playbutton
    var playButton = document.getElementById("playButton");
    var isPlaying = false;
    var beforeButton = document.getElementById("beforeButton");
    var afterButton = document.getElementById("afterButton");
    var muteButton = document.getElementById("muteButton");

    beforeButton.addEventListener("click", function () {
        if (currentAudioIndex >= 0 && currentAudioIndex < audioList.length) {
            // Az aktuális audio leállítása
            audioList[currentAudioIndex].pause();
            audioList[currentAudioIndex].currentTime = 0;

            // Az előző audio lejátszása, ha van ilyen
            currentAudioIndex = Math.max(0, currentAudioIndex - 1);
            audioList[currentAudioIndex].play();
        }
    });

    afterButton.addEventListener("click", function () {
        console.log(audioList);
        if (currentAudioIndex >= 0 && currentAudioIndex < audioList.length - 1) {
            // Az aktuális audio leállítása
            audioList[currentAudioIndex].pause();
            audioList[currentAudioIndex].currentTime = 0;

            // A következő audio lejátszása, ha van ilyen
            currentAudioIndex = Math.min(audioList.length - 1, currentAudioIndex + 1);
            console.log(currentAudioIndex);
            audioList[currentAudioIndex].play();
        }
    });

    muteButton.addEventListener("click", function () {
        if (currentAudioIndex >= 0 && currentAudioIndex < audioList.length) {
            // Az aktuális audio némaítása vagy visszaállítása
            audioList[currentAudioIndex].muted = !audioList[currentAudioIndex].muted;
        }
    });

    playButton.addEventListener("click", function () {
        if (currentAudio) {
            if (isPlaying) {
                currentAudio.pause();
            } else {
                currentAudio.play();
            }

            isPlaying = !isPlaying;
        }
    });
    // A DOM betöltődése után hozzáadjuk a gombra a kattintás eseménykezelőt
    document.getElementById("newMusicButton").addEventListener("click", function () {
        // Bekérjük az MP3 fájl elérését a felhasználótól
        var mp3FileInput = document.createElement("input");
        mp3FileInput.type = "file";
        mp3FileInput.accept = "audio/mp3";

        mp3FileInput.addEventListener("change", function (event) {
            var file = event.target.files[0];

            if (file) {
                // Az mp3 fájl adatainak kinyerése
                var reader = new FileReader();
                reader.onload = function (e) {
                    // Ha már megy zene, akkor állítsa le azt
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }

                    var audio = new Audio();

                    audio.src = e.target.result;

                    audio.addEventListener("loadedmetadata", function () {
                        // Fájl adatainak kiírása a képernyőre
                        addNewMusicRow(file.name, "Ismeretlen", formatTime(audio.duration), id, audio);
                        
                        // Növeljük az id számlálót
                        id++;
                    });

                    // Mentjük az aktuális lejátszót
                    currentAudio = audio;
                    audioList.push(audio);

                    audio.load();
                };

                reader.readAsDataURL(file);
            }
        });

        mp3FileInput.click();
    });

    // Egyéb funkciók
    function addNewMusicRow(title, artist, duration, currentId, audio) {
        // Létrehozzuk az új sor divet
        var newRow = document.createElement("div");
        newRow.className = "row musik";

        // Az "id" oszlop
        var idDiv = document.createElement("div");
        idDiv.className = "col-1 id";
        idDiv.innerHTML = '<div class="mb-2">' + currentId + '</div>';

        // A "name" oszlop
        var nameDiv = document.createElement("div");
        nameDiv.className = "col-4 name";
        nameDiv.innerHTML = '<p class="text-left">' + title + '</p>';

        // Az "author" oszlop
        var authorDiv = document.createElement("div");
        authorDiv.className = "col-3 author";
        authorDiv.innerHTML = '<p>' + artist + '</p>';

        // A "gugu" oszlop
        var guguDiv = document.createElement("div");
        guguDiv.className = "col-3 gugu";
        guguDiv.innerHTML = '<p>' + 'Cuccli' + '</p>';

        // Az "time" oszlop
        var timeDiv = document.createElement("div");
        timeDiv.className = "col-1 time";
        timeDiv.innerHTML = '<p>' + duration + '</p>';

        // Az új sorhoz hozzáadjuk az eseménykezelőt a lejátszás funkcióval
        newRow.addEventListener("click", function () {
            // Ha már megy zene, akkor állítsa le azt
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Kezdje el lejátszani az új zenét
            audio.play();
            currentAudio = audio;
        });

        newRow.addEventListener("click", function () {
            // Ha már megy zene, akkor állítsa le azt
            if (currentAudioIndex >= 0 && currentAudioIndex < audioList.length) {
                audioList[currentAudioIndex].pause();
                audioList[currentAudioIndex].currentTime = 0;
            }

            // Kezdje el lejátszani az új zenét
            audio.play();
            currentAudioIndex = currentId - 1;
        });

        // A létrehozott elemeket hozzáadjuk az új sorhoz
        newRow.appendChild(idDiv);
        newRow.appendChild(nameDiv);
        newRow.appendChild(authorDiv);
        newRow.appendChild(guguDiv);
        newRow.appendChild(timeDiv);

        // Az új sort hozzáadjuk a meglévő zenelista sorokhoz
        document.querySelector(".second").appendChild(newRow);
    }

    // Másodpercből formázott idő létrehozása (mm:ss)
    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        // Idő formázása mm:ss formátumba
        return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
});

/* From: https://www.smartinfogl.com/2024/01/modern-javascript-volume-slider.html */
function audio() {
    "use strict";

    var thisScript =
        document.currentScript ||
        (function () {
            var s = document.getElementsByTagName("script");
            return s[s.length - 1];
        })();

    // audio.js lives in /script/, the file lives in /assets/ -> works from any page.
    var AUDIO_SRC = new URL(
        "../assets/bg_music_maze_runner.mp3",
        thisScript.src
    ).href;

    var KEY_TIME = "mr_music_time";
    var KEY_VOL = "mr_music_volume";

    function store(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (e) {
            /* private mode / storage disabled */
        }
    }

    function read(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    // ---- audio element -----------------------------------------------------

    var audio = document.getElementById("mr-bg-music");
    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "mr-bg-music";
        audio.src = AUDIO_SRC;
        audio.loop = true;
        audio.preload = "auto";
        document.documentElement.appendChild(audio);
    }

    var savedVol = parseFloat(read(KEY_VOL));
    if (isNaN(savedVol)) {
        savedVol = 0.5;
    }
    savedVol = Math.min(1, Math.max(0, savedVol));
    audio.volume = savedVol;

    var savedTime = parseFloat(read(KEY_TIME));
    if (!isNaN(savedTime) && savedTime > 0) {
        var applyTime = function () {
            try {
                audio.currentTime = savedTime;
            } catch (e) {
                /* metadata not ready yet / out of range */
            }
        };
        if (audio.readyState >= 1) {
            applyTime();
        } else {
            audio.addEventListener("loadedmetadata", applyTime, { once: true });
        }
    }

    // ---- start playback (respecting browser autoplay rules) --------------

    function resumeOnGesture() {
        var events = ["pointerdown", "keydown", "touchstart"];
        var start = function () {
            audio.play().catch(function () {});
            events.forEach(function (ev) {
                document.removeEventListener(ev, start);
            });
        };
        events.forEach(function (ev) {
            document.addEventListener(ev, start);
        });
    }

    var playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(resumeOnGesture);
    }

    // ---- persist playback position -------------------------------------

    var lastSave = 0;
    audio.addEventListener("timeupdate", function () {
        var now = Date.now();
        if (now - lastSave > 1000) {
            lastSave = now;
            store(KEY_TIME, audio.currentTime);
        }
    });

    function saveNow() {
        store(KEY_TIME, audio.currentTime);
    }

    audio.addEventListener("pause", saveNow);
    window.addEventListener("pagehide", saveNow);
    window.addEventListener("beforeunload", saveNow);
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            saveNow();
        }
    });

    // ---- volume widget -------------------------------------------------

    var WIDGET_HTML =
        '<svg class="audio-widget__icon" viewBox="-10 -14 52 52" xmlns="http://www.w3.org/2000/svg" width="50">' +
        '<g stroke="#55433b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="transparent">' +
        '<path stroke-width="4" fill="#55433b" d="M8 9H5v6h3l5 4V5L8 9z"></path>' +
        '<path d="M18.5 8a3.657 5 0 010 8" class="low hidden"></path>' +
        '<path d="M23 6a2.657 6.5 0 010 12" class="medium hidden"></path>' +
        '<path d="M27 3a3.5 9.1 0 010 18" class="high hidden"></path>' +
        '<path d="M20 9L26 15M26 9L20 15" class="mute hidden"></path>' +
        "</g></svg>" +
        '<div class="audio-widget__field">' +
        '<input type="range" id="volume" class="audio-widget__range" min="0" max="100" value="50" aria-label="Music volume">' +
        "</div>";

    function mountWidget() {
        var container = document.querySelector("[data-audio-widget]");
        if (container) {
            container.classList.add("audio-widget");
            container.innerHTML = WIDGET_HTML;
        } else {
            container = document.createElement("div");
            container.className = "audio-widget audio-widget--floating";
            container.innerHTML = WIDGET_HTML;
            document.body.appendChild(container);
        }
        wireWidget(container);
    }

    function wireWidget(root) {
        var input = root.querySelector('input[type="range"]');
        if (!input) {
            return;
        }
        var svg = root.querySelector("svg");
        var icons = Array.prototype.slice.call(
            root.querySelectorAll(".low, .medium, .high, .mute")
        );

        input.value = Math.round(savedVol * 100);

        function showLevel(n) {
            if (n === 0) {
                icons[3].classList.remove("hidden");
            }
            for (var i = 0; i < n; i++) {
                icons[i].classList.remove("hidden");
            }
        }

        function refresh() {
            icons.forEach(function (el) {
                el.classList.add("hidden");
            });
            var v = parseInt(input.value, 10) || 0;
            var level = v >= 70 ? 3 : v >= 30 ? 2 : v > 0 ? 1 : 0;
            showLevel(level);
            audio.volume = v / 100;
            store(KEY_VOL, audio.volume);
        }

        input.addEventListener("input", refresh);

        // The slider is a pop-out: hidden until the icon is clicked/focused,
        // and it collapses again once neither the icon nor the slider is focused.
        if (svg) {
            svg.setAttribute("tabindex", "0");
            svg.setAttribute("role", "button");
            svg.setAttribute("aria-label", "Toggle volume slider");

            function setOpen(open) {
                root.classList.toggle("audio-widget--open", open);
            }

            svg.addEventListener("click", function () {
                setOpen(!root.classList.contains("audio-widget--open"));
            });

            svg.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    setOpen(!root.classList.contains("audio-widget--open"));
                }
            });

            root.addEventListener("focusout", function (e) {
                if (!root.contains(e.relatedTarget)) {
                    setOpen(false);
                }
            });

            document.addEventListener("pointerdown", function (e) {
                if (!root.contains(e.target)) {
                    setOpen(false);
                }
            });
        }

        refresh();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountWidget);
    } else {
        mountWidget();
    }
}

audio();
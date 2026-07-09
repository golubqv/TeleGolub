import { auth } from "./firebase.js";

/* ===========================
   LOADER
=========================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 300);

    }, 600);

});

/* ===========================
   TOAST
=========================== */

let toastTimeout = null;

window.showToast = function (text) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = text;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

};

/* ===========================
   IMAGE VIEWER
=========================== */

window.openImageViewer = function (src) {

    const viewer = document.getElementById("imageViewer");

    const image = document.getElementById("viewerImage");

    image.src = src;

    viewer.style.display = "flex";

};

window.closeImageViewer = function () {

    document.getElementById("imageViewer").style.display = "none";

};

/* ===========================
   PROFILE
=========================== */

window.openProfile = function (name, username) {

    document.getElementById("profileName").innerText = name;

    document.getElementById("profileUsername").innerText = username;

    document.getElementById("profileModal").style.display = "flex";

};

window.closeProfile = function () {

    document.getElementById("profileModal").style.display = "none";

};

/* ===========================
   ESC
=========================== */

document.addEventListener("keydown", e => {

    if (e.key !== "Escape") return;

    closeImageViewer();

    closeProfile();

});

/* ===========================
   CLICK OUTSIDE
=========================== */

document.getElementById("imageViewer")?.addEventListener("click", e => {

    if (e.target.id === "imageViewer") {

        closeImageViewer();

    }

});

document.getElementById("profileModal")?.addEventListener("click", e => {

    if (e.target.id === "profileModal") {

        closeProfile();

    }

});

/* ===========================
   ENTER SEND
=========================== */

document.getElementById("message")?.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        sendMessage();

    }

});

/* ===========================
   AUTH
=========================== */

auth.onAuthStateChanged(user => {

    if (!user) return;

    console.log("

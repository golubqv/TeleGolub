import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    initializeAppCheck,
    ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app-check.js";

const firebaseConfig = {
    apiKey: "AIzaSyDLMgpqiXGxmbiTCrN7v-ukyd52BSwxihI",
    authDomain: "telegolub-app.firebaseapp.com",
    projectId: "telegolub-app",
    storageBucket: "telegolub-app.firebasestorage.app",
    messagingSenderId: "153463660671",
    appId: "1:153463660671:web:1240cb7686be79dcf21f4a"
};

const app = initializeApp(firebaseConfig);

// App Check
initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
        "6Lf4eEotAAAAAHEnRWw7LE4CUu1PAQiTYb8BTzpN"
    ),
    isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);

export const db = getFirestore(app);

export { app };

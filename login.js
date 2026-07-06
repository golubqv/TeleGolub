import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

window.register = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Заполните все поля.");
        return;
    }

    if (password.length < 6) {
        alert("Пароль должен содержать минимум 6 символов.");
        return;
    }

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href = "setup.html";

    } catch (e) {

        switch (e.code) {

            case "auth/email-already-in-use":
                alert("Этот email уже зарегистрирован.");
                break;

            case "auth/invalid-email":
                alert("Некорректный email.");
                break;

            case "auth/weak-password":
                alert("Слишком простой пароль.");
                break;

            default:
                alert(e.message);

        }

    }

};

window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Заполните все поля.");
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href = "index.html";

    } catch (e) {

        alert("Неверный email или пароль.");

    }

};

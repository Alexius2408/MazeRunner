const link = document.getElementById("email");
const homeButton = document.getElementById("home_button");

homeButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

const data = [
    97, 108, 101, 120, 97, 110, 100, 101, 114, 46, 115, 105, 101, 102, 64,
    115, 116, 117, 100, 101, 110, 116, 115, 46, 104, 116, 108, 45, 105, 98,
    107, 46, 97, 116,
];

const email = String.fromCharCode(...data);

link.href = "mailto:" + email;
link.textContent = email;
const creditsButton = document.getElementById("credits_button");
const impressumButton = document.getElementById("impressum_button");
const startButton = document.getElementById("start_button");
const sizeRange = document.getElementById("size_range");
const sizeValue = document.getElementById("size_value");

creditsButton.addEventListener("click", () => {
    window.location.href = "./Website_datein/Credits.html";
});

impressumButton.addEventListener("click", () => {
    window.location.href = "./Website_datein/Impressum.html";
});

function syncSizeLabel() {
    sizeValue.textContent = `${sizeRange.value} x ${sizeRange.value}`;
}

sizeRange.addEventListener("input", syncSizeLabel);

window.addEventListener("pageshow", syncSizeLabel);

startButton.addEventListener("click", () => {
    sessionStorage.setItem("mazeSize", sizeRange.value);
    window.location.href = "./Website_datein/Maze.html";
});
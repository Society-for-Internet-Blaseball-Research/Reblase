const media = window.matchMedia("(prefers-color-scheme: dark)");

function current(): "light" | "dark" {
    const text = window.localStorage.getItem("color-scheme");
    if (text === "light" || text === "dark") {
        return text;
    }
    return media.matches ? "dark" : "light";
}

function update() {
    if (current() === "dark") {
        document.documentElement.classList.add("mode-dark");
    } else {
        document.documentElement.classList.remove("mode-dark");
    }
}

export function setup() {
    update();
    media.addListener(update);
}

export function toggle() {
    const swap = current() === "light" ? "dark" : "light";
    window.localStorage.setItem("color-scheme", swap);
    update();
}

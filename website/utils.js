export function enableDisplay(element, enable) {
    element.style.display = enable ? "inline-block" : "none";
}

export function toHomePage() {
    redirect("./index.html");
}

export function redirect(path) {
    window.location.replace(path);
}
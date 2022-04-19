export function enableDisplay(element, enable) {
    element.style.display = enable ? "inline-block" : "none";
}

export function toHomePage() {
    redirect("./index.html");
}

export function redirect(path) {
    window.location.replace(path);
}

export function getUserImage(user) {
    if ('image' in user) {
        return user.getImage();
    } else {
        return "../default-user-icon.jpg";
    }
}

export function timestampToDate(timestamp) {
    let lang = navigator.language || navigator.userLanguage;
    let date = new Date(timestamp).toLocaleDateString(lang);
    return date;
}
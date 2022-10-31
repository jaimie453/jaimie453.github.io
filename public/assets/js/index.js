//
// show the correct favicon in light/dark mode
//
const faviconPngLink = document.getElementById("faviconPng");
const usingDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (!usingDarkMode) faviconPngLink.href = `/assets/images/favicon-light.png`

window.matchMedia('(prefers-color-scheme: dark)').onchange = (event) => {
    const theme = event.matches ? "dark" : "light";
    faviconPngLink.href = `/assets/images/favicon-${theme}.png`
};


//
// handle mobile nav menu interaction
//
const header = document.getElementById("header");
const htmlTag = document.getElementById("html");
const menuTrigger = document.getElementById("navMenuTrigger");
let resizeTimeout;

function toggleMenu() {
    header.classList.toggle("header__open");
    htmlTag.classList.toggle("hide-scroll");

    const isMenuOpen = header.classList.contains("header__open");
    menuTrigger.setAttribute("aria-expanded", isMenuOpen);

    if (isMenuOpen) {
        menuTrigger.innerHTML = "Close";
        document.addEventListener("keydown", handleMenuEscape);
        header.addEventListener("focusout", handleFocusOutside);
        window.addEventListener("resize", handleResize);
    } else {
        menuTrigger.innerHTML = "Menu";
        document.removeEventListener("keydown", handleMenuEscape);
        header.removeEventListener("focusout", handleFocusOutside);
        window.removeEventListener("resize", handleResize);
    }
}

function handleMenuEscape(event) {
    if (event.key === 'Escape') {
        closeMenu();
        menuTrigger.focus();
    }
}

function handleResize() {
    if (!!resizeTimeout) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        const fontSizeInPx = window.getComputedStyle(htmlTag).fontSize;
        const fontSizeInRem = parseFloat(fontSizeInPx.substr(0, fontSizeInPx.indexOf("px")));
        const windowWidthInRem = window.innerWidth / fontSizeInRem;
        const navMenuMaxWidth = 36; // rem value in sass

        if (windowWidthInRem > navMenuMaxWidth) closeMenu();
    }, 250);
}

function handleFocusOutside(event) {
    // prevent close on tap/click
    if(!event.relatedTarget) return;

    const isFocusInsideHeader = header.contains(event.relatedTarget);
    if (!isFocusInsideHeader) closeMenu();
}

function closeMenu() {
    header.classList.remove("header__open");
    htmlTag.classList.remove("hide-scroll");

    menuTrigger.setAttribute("aria-expanded", false);
    menuTrigger.innerHTML = "Menu";

    document.removeEventListener("keydown", handleMenuEscape);
    document.removeEventListener("resize", handleResize);
}


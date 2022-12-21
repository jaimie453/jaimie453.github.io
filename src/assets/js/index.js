"use strict";

//
// show the correct favicon in light/dark mode
//
const faviconPngLink = document.getElementById("faviconPng");
const usingDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

if (!usingDarkMode) faviconPngLink.href = `/assets/images/favicon-light.png`;

window.matchMedia("(prefers-color-scheme: dark)").onchange = (event) => {
  const theme = event.matches ? "dark" : "light";
  faviconPngLink.href = `/assets/images/favicon-${theme}.png`;
};

//
// handle mobile nav menu interaction
//
const header = document.getElementById("header");
const htmlTag = document.getElementById("html");
const menuTrigger = document.getElementById("navMenuTrigger");
let resizeTimeout;

function toggleMenu() {
  const pageOverlay = document.getElementById("pageOverlay");

  if (header.classList.contains("header--open")) {
    pageOverlay.classList.remove("page-overlay--fade-in");
    pageOverlay.classList.add("page-overlay--fade-out");
  } else {
    pageOverlay.classList.remove("page-overlay--fade-out");
    pageOverlay.classList.add("page-overlay--fade-in");
  }

  header.classList.toggle("header--open");
  const isMenuOpen = header.classList.contains("header--open");
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
  if (event.key === "Escape") {
    closeMenu();
    menuTrigger.focus();
  }
}

function handleResize() {
  if (!!resizeTimeout) clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const fontSizeInPx = window.getComputedStyle(htmlTag).fontSize;
    const fontSizeInRem = parseFloat(
      fontSizeInPx.substring(0, fontSizeInPx.indexOf("px"))
    );
    const windowWidthInRem = window.innerWidth / fontSizeInRem;
    const navMenuMaxWidth = 36; // rem value in sass

    if (windowWidthInRem > navMenuMaxWidth) closeMenu();
  }, 250);
}

function handleFocusOutside(event) {
  // prevent close on tap/click
  if (!event.relatedTarget) return;

  const isFocusInsideHeader = header.contains(event.relatedTarget);
  if (!isFocusInsideHeader) closeMenu();
}

function closeMenu() {
  header.classList.remove("header--open");

  menuTrigger.setAttribute("aria-expanded", false);
  menuTrigger.innerHTML = "Menu";

  document.removeEventListener("keydown", handleMenuEscape);
  header.removeEventListener("focusout", handleFocusOutside);
  window.removeEventListener("resize", handleResize);
}

//
// handle page fade
//
// TODO: check for reduced motion preference before doing this
document.addEventListener("DOMContentLoaded", () => {
  handleLinkClicks();
});

function handleLinkClicks() {
  document.addEventListener("click", (event) => {
    let clickTarget = event.target;

    // get parent <a> if a child element was clicked
    while (clickTarget && clickTarget.nodeName !== "A") {
      clickTarget = clickTarget.parentNode;
    }

    if (!clickTarget) {
      return;
    } else if (isInternalLink(clickTarget)) {
      fadeOutPage(event, clickTarget.href);
    }
  });
}

// ignore id links on the current page e.g. localhost/#main
function isInternalLink(link) {
  const inSameDomain = link.origin === window.location.origin;
  const linksToIdOnCurrentPage =
    link.pathname === window.location.pathname && link.href.includes("#");
  const isResumeLink = link.href.includes("resume.pdf");

  return inSameDomain && !linksToIdOnCurrentPage && !isResumeLink;
}

function fadeOutPage(linkEvent, href) {
  let pageOverlay = document.getElementById("pageOverlay");

  pageOverlay.addEventListener("animationend", () => {
    window.location = href;
  });

  linkEvent.preventDefault();
  pageOverlay.classList.add("page-overlay--fade-in");
}

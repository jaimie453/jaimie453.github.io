//
//  Handle mobile nav menu interaction
//
//  The menu follows the disclosure ARIA pattern,
//  https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
//  since it's the closest thing to a full screen menu
//    - closes with Esc and when focus exits the nav
//    - page content is still present, just not visible
//  a dialog (traps focus) could also work

navMenuTrigger.addEventListener("click", toggleMenu);

function toggleMenu() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMenuOpen = navContent.classList.contains("nav__content--open");
  navMenuTrigger.setAttribute("disabled", true);

  if (prefersReducedMotion) {
    toggleStaticMenuVisibility(isMenuOpen);
    toggleMenuInteraction();
  } else {
    toggleAnimatedMenuVisibility(isMenuOpen, toggleMenuInteraction);
  }
}

function toggleMenuInteraction() {
  const isMenuOpen = navContent.classList.contains("nav__content--open");

  navMenuTrigger.setAttribute("aria-expanded", isMenuOpen);
  navMenuTrigger.removeAttribute("disabled");

  if (isMenuOpen) {
    addEventListeners();
  } else {
    removeEventListeners();
  }
}

//
//  Handle menu visibility and animations
//

function toggleStaticMenuVisibility(isMenuOpen) {
  pageContent.classList.toggle("visually-hidden");
  navContent.classList.toggle("nav__content--open");
  navMenuTrigger.innerHTML = isMenuOpen ? "Menu" : "Close";
}

function toggleAnimatedMenuVisibility(isMenuOpen, updateMenu) {
  if (isMenuOpen) {
    navContent.updateMenu = updateMenu;
    navContent.addEventListener("animationend", handleNavContentFadeOut);

    navContent.classList.remove("fade-in");
    navContent.classList.add("fade-out");
  } else {
    pageOverlay.updateMenu = updateMenu;
    pageOverlay.addEventListener("animationend", handlePageOverlayFadeOut);

    pageOverlay.classList.remove("fade-out");
    pageOverlay.classList.add("fade-in");
  }

  navMenuTrigger.classList.remove("fade-in");
  navMenuTrigger.classList.add("fade-out");
}

function handlePageOverlayFadeOut(event) {
  if (event.animationName === "fade-in") {
    pageContent.classList.add("visually-hidden");
    navContent.classList.add("fade-in", "nav__content--open");

    navMenuTrigger.innerHTML = "Close";
    navMenuTrigger.classList.remove("fade-out");
    navMenuTrigger.classList.add("fade-in");

    event.currentTarget.updateMenu();
    pageOverlay.removeEventListener("animationend", handlePageOverlayFadeOut);
  }
}

function handleNavContentFadeOut(event) {
  if (event.animationName === "fade-out") {
    navContent.classList.remove("nav__content--open");
    navContent.classList.remove("fade-out");

    pageOverlay.classList.remove("fade-in");
    pageOverlay.classList.add("fade-out");

    navMenuTrigger.innerHTML = "Menu";
    navMenuTrigger.classList.remove("fade-out");
    navMenuTrigger.classList.add("fade-in");

    pageContent.classList.remove("visually-hidden");

    event.currentTarget.updateMenu();
    navContent.removeEventListener("animationend", handleNavContentFadeOut);
  }
}

//
//  Handle menu interaction
//

function addEventListeners() {
  document.addEventListener("keydown", handleMenuEscape);
  nav.addEventListener("focusout", handleFocusOutside);
  window.addEventListener("resize", handleResize);
}

function removeEventListeners() {
  document.removeEventListener("keydown", handleMenuEscape);
  nav.removeEventListener("focusout", handleFocusOutside);
  window.removeEventListener("resize", handleResize);
}

function handleMenuEscape(event) {
  if (event.key === "Escape") {
    toggleMenu();
    navMenuTrigger.focus();
  }
}

let resizeTimeout;
function handleResize() {
  if (!!resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(() => {
    const fontSizeInPx = window.getComputedStyle(html).fontSize;
    const fontSizeInRem = parseFloat(
      fontSizeInPx.substring(0, fontSizeInPx.indexOf("px"))
    );
    const windowWidthInRem = window.innerWidth / fontSizeInRem;
    const NAV_MENU_MAX_WIDTH_IN_REM = 36;

    if (windowWidthInRem > NAV_MENU_MAX_WIDTH_IN_REM) {
      toggleMenu();
    }
  }, 250);
}

function handleFocusOutside(event) {
  // prevent close when clicking empty space inside the nav
  if (!event.relatedTarget) {
    return;
  }

  const isFocusInsideNav = nav.contains(event.relatedTarget);
  if (!isFocusInsideNav) {
    toggleMenu();
  }
}

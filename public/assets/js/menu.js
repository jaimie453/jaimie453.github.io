//
// handle mobile nav menu interaction
//

// TODO: move elsewhere
let resizeTimeout;
navMenuTrigger.addEventListener("click", handleMenuToggle);

function handleMenuToggle() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  let isMenuOpen = header.classList.contains("header--open");

  if (prefersReducedMotion) {
    console.log("reduced motion");
    toggleMenuWithoutAnimation(isMenuOpen);
  } else {
    toggleMenuWithAnimation(isMenuOpen);
  }

  header.classList.toggle("header--open");
  isMenuOpen = !isMenuOpen;

  navMenuTrigger.setAttribute("aria-expanded", isMenuOpen);
  navMenuTrigger.innerHTML = isMenuOpen ? "Close" : "Menu";

  // if (isMenuOpen) {
  //     document.addEventListener("keydown", handleMenuEscape);
  //     header.addEventListener("focusout", handleFocusOutside);
  //     window.addEventListener("resize", handleResize);
  // } else {
  //     document.removeEventListener("keydown", handleMenuEscape);
  //     header.removeEventListener("focusout", handleFocusOutside);
  //     window.removeEventListener("resize", handleResize);
  // }
}

//
//  Handle menu animation
//

function toggleMenuWithoutAnimation(isMenuOpen) {
  if (isMenuOpen) {
    navContent.classList.remove("nav__content--open");
    pageContent.classList.remove("visually-hidden");
  } else {
    pageContent.classList.add("visually-hidden");
    navContent.classList.add("nav__content--open");
  }
}

function toggleMenuWithAnimation(isMenuOpen) {
  if (isMenuOpen) {
    navContent.addEventListener("animationend", handleNavContentAnimationEnd);

    navContent.classList.remove("fade-in");
    navContent.classList.add("fade-out");
  } else {
    pageOverlay.addEventListener("animationend", handlePageOverlayAnimationEnd);

    pageOverlay.classList.remove("fade-out");
    pageOverlay.classList.add("fade-in");
  }
}

function handlePageOverlayAnimationEnd(event) {
  if (event.animationName === "fade-in") {
    pageContent.classList.add("visually-hidden");
    navContent.classList.add("fade-in", "nav__content--open");

    pageOverlay.removeEventListener(
      "animationend",
      handlePageOverlayAnimationEnd
    );
  }
}

function handleNavContentAnimationEnd(event) {
  if (event.animationName === "fade-out") {
    navContent.classList.remove("nav__content--open");

    pageOverlay.classList.remove("fade-in");
    pageOverlay.classList.add("fade-out");

    pageContent.classList.remove("visually-hidden");

    navContent.removeEventListener(
      "animationend",
      handleNavContentAnimationEnd
    );
  }
}

//
//  Handle menu interaction
//

// function handleMenuEscape(event) {
//     if (event.key === "Escape") {
//         closeMenu();
//         navMenuTrigger.focus();
//     }
// }

// function handleResize() {
//     if (!!resizeTimeout) clearTimeout(resizeTimeout);

//     resizeTimeout = setTimeout(() => {
//         const fontSizeInPx = window.getComputedStyle(html).fontSize;
//         const fontSizeInRem = parseFloat(
//             fontSizeInPx.substring(0, fontSizeInPx.indexOf("px"))
//         );
//         const windowWidthInRem = window.innerWidth / fontSizeInRem;
//         const navMenuMaxWidth = 36; // rem value in sass

//         if (windowWidthInRem > navMenuMaxWidth) closeMenu();
//     }, 250);
// }

// function handleFocusOutside(event) {
//     // prevent close on tap/click
//     if (!event.relatedTarget) return;

//     const isFocusInsideHeader = header.contains(event.relatedTarget);
//     if (!isFocusInsideHeader) closeMenu();
// }

// function closeMenu() {
//     header.classList.remove("header--open");

//     navMenuTrigger.setAttribute("aria-expanded", false);
//     navMenuTrigger.innerHTML = "Menu";

//     document.removeEventListener("keydown", handleMenuEscape);
//     header.removeEventListener("focusout", handleFocusOutside);
//     window.removeEventListener("resize", handleResize);
// }

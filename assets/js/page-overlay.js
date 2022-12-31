//
// handle page fade
//

fadeInPage();
document.addEventListener("DOMContentLoaded", () => {
  handleLinkClicks();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    fadeInPage();
  }
});

function fadeInPage() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!prefersReducedMotion) {
    pageOverlay.classList.remove("fade-in");
    pageOverlay.classList.add("fade-out");
  }
}

function handleLinkClicks() {
  document.addEventListener("click", (event) => {
    let clickTarget = event.target;

    // get parent <a> if a child element was clicked
    while (clickTarget && clickTarget.nodeName !== "A") {
      clickTarget = clickTarget.parentNode;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!clickTarget) {
      return;
    } else if (isInternalLink(clickTarget) && !prefersReducedMotion) {
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
  const isMenuOpen = navContent.classList.contains("nav__content--open");

  let fadeOutTarget = isMenuOpen ? navContent : pageOverlay;
  const onAnimationEnd = () => {
    window.location = href;
    fadeOutTarget.removeEventListener("animationend", onAnimationEnd);
  };

  fadeOutTarget.addEventListener("animationend", onAnimationEnd);

  linkEvent.preventDefault();

  if (isMenuOpen) {
    navContent.classList.remove("fade-in");
    navContent.classList.add("fade-out");
  } else {
    pageOverlay.classList.add("fade-in");
  }
}

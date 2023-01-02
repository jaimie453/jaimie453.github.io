//
// handle page fade
//

fadeInPage();

window.addEventListener("pageshow", (event) => {
  // re-run fade-in only when the page is cached
  if (event.persisted) {
    //alert("cached");
    fadeInPage();
  }

  handleLinkClicks();
});

function fadeInPage() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  pageOverlay.classList.remove("fade-in");
  if (!prefersReducedMotion) {
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
  const onAnimationEnd = () => {
    window.location = href;
    pageOverlay.removeEventListener("animationend", onAnimationEnd);
  };

  pageOverlay.addEventListener("animationend", onAnimationEnd);

  linkEvent.preventDefault();
  pageOverlay.classList.add("fade-in");
}

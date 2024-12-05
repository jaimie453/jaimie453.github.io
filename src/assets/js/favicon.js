//
// show the correct favicon in light/dark mode
//

const usingDarkMode =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

if (!usingDarkMode) {
  faviconPng.href = '/assets/images/favicon-light.png';
}

window.matchMedia('(prefers-color-scheme: dark)').onchange = (event) => {
  const theme = event.matches ? 'dark' : 'light';
  faviconPng.href = `/assets/images/favicon-${theme}.png`;
};

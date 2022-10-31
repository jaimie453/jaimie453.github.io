// unused, sticking with os preferences & no switcher

const htmlTag = document.getElementsByTagName("html")[0];
const themeRadios = Array.from(document.getElementsByClassName("theme-switcher__radio"));
const theme = localStorage.getItem("theme") ?? "system";
if (theme !== "system") {
    htmlTag.classList.add(theme);
}
const selectedRadio = themeRadios.find(option => option.value === theme);
selectedRadio.setAttribute("checked", null);
themeRadios.forEach(option => {
    option.addEventListener("change", () => {
        htmlTag.removeAttribute("class");
        if (option.value === "system") {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", option.value);
            htmlTag.classList.add(option.value);
        }
    });
});
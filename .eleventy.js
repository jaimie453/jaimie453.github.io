const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/style.css");
    eleventyConfig.addWatchTarget("./src/sass/");
    eleventyConfig.addPlugin(syntaxHighlight);
    
    return {
      dir: {
        input: "src",
        output: "public",
      },
    };
  };
module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/style.css");
    eleventyConfig.addWatchTarget("./src/sass/");
    
    return {
      dir: {
        input: "src",
        output: "public",
      },
    };
  };
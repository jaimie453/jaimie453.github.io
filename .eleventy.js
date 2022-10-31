module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/images");
    eleventyConfig.addWatchTarget("./src/sass/");
    
    return {
      dir: {
        input: "src",
        output: "public",
      },
    };
  };
import _ from "lodash";
import ExtractTextPlugin, { extract } from "extract-text-webpack-plugin";

export default (config, options) => {
  const cssLoaderQuery = `?${options.optimize ? "" : "-"}minimize`;
  const stylesheetLoaders = [
    { test: /\.css/, loader: `css${cssLoaderQuery}` },
    { test: /\.less/, loader: `css${cssLoaderQuery}!less` },
  ];

  let loaders = [];
  for (let loader of stylesheetLoaders) {
    if (options.prerender) {
      loader.loader = "null";
    } else if (options.separateStylesheet) {
      loader.loader = extract("style", loader.loader);
    } else {
      loader.loader = `style!${loader.loader}`;
    }
    loaders.push(loader);
  }

  config.module.loaders = config.module.loaders.concat(loaders);

  if (options.separateStylesheet) {
    config.plugins.push(new ExtractTextPlugin(`app${options.optimize ? ".min" : ""}.css`));
  }
  return config;
};

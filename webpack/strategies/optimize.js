import _ from "lodash";
import { optimize, NoErrorsPlugin } from "webpack";

export default (config, options) => {
  if (options.optimize) {
    config = _.extend({}, config, {
      output: _.extend({}, config.output, {
        filename: "[name].min.js"
      })
    });
    config.plugins = config.plugins.concat([
      new NoErrorsPlugin(),
      new optimize.UglifyJsPlugin(),
      new optimize.DedupePlugin(),
      new optimize.CommonsChunkPlugin(
        "commons",
        `commons${options.longTermCaching ? "-[chunkhash]": ""}.js`,
        Object.keys(config.entry)
     ),
   ]);
    return config;
  }

  return config;
};

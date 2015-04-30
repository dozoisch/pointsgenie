import { join } from "path";
import _ from "lodash";
import webpack from "webpack";
import strategies from "./strategies";
import yargs from "yargs";


const argv = yargs
  .usage("Usage: $0 [options] --api-url [url]")
  .alias("a", "api-url")
  .alias("p", "optimize-minimize")
  .alias("d", "debug")
  .alias("s", "dev-server")
  .argv;

const defaultOptions = {
  development: argv.debug,
  docs: false,
  test: false,
  optimize: argv.optimizeMinimize,
  devServer: argv.devServer,
  separateStylesheet: argv.separateStylesheet,
  apiUrl: argv.apiUrl || ""
};

export default (options) => {
  options = _.merge({}, defaultOptions, options);

  options.publicPath = options.devServer ? "//localhost:2992/_assets/" : "";
  const environment = options.test || options.development ? "development" : "production";

  const babelLoader = "babel?optional[]=runtime" +
    "&optional[]=es7.objectRestSpread&optional[]=es7.asyncFunctions&optional[]=es7.classProperties";

  const reactLoader = options.development ? `react-hot!${babelLoader}` : babelLoader;
  const chunkFilename = (options.devServer ? "[id].js" : "[name].js") +
    (options.longTermCaching ? "?[chunkhash]" : "");

  const root = join(__dirname, "..");

  options.excludeFromStats = [
    /node_modules/,
  ];

  const config = {
    entry: {
      "app": join(root, "app", "app.js"),
      "admin": join(root, "app", "admin-app.jsx"),
    },

    output: {
      path: join(root, "build", "public"),
      filename: "[name].js",
      chunkFilename: chunkFilename,
      publicPath: options.publicPath,
      sourceMapFilename: "debugging/[file].map",
    },

    externals: [
    ],

    resolve: {
      extensions: ["",".js",".jsx"],
      alias: {
        // shared: join(root, "shared"),
        // client: join(root, "client"),
        // app: join(root, "app"),
      },
    },

    module: {
      loaders: [
        { test: /\.(js|jsx)/, loader: reactLoader, exclude: /node_modules/ },
        { test: /\.json/, loader: "json" },
        { test: /\.(woff|woff2)/, loader: "url?limit=100000" },
        { test: /\.(png|jpg|jpeg|gif|svg)/, loader: "url?limit=100000" },
        { test: /\.(ttf|eot)/, loader: "file" },
      ]
    },

    plugins: [
      new webpack.PrefetchPlugin("react"),
      new webpack.PrefetchPlugin("react-bootstrap"),
      new webpack.PrefetchPlugin("react-router/build/npm/lib"),
      new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
      new webpack.PrefetchPlugin("flummox"),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(environment),
          API_URL: JSON.stringify(defaultOptions.apiUrl),
        }
      }),
    ],

    devServer: {
      stats: {
        exclude: options.excludeFromStats
      }
    }
  };

  return strategies.reduce((conf, strategy) => {
    return strategy(conf, options);
  }, config);
}

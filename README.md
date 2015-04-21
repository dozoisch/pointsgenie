# Site des points Genie UdeS 2014
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/dozoisch/pointsgenie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Build Status][travis.img]][travis.url]
[![Dependencies][deps.img]][deps.url]
[![Dev Dependencies][devdeps.img]][devdeps.url]
[![Tasks][tasks.img]][tasks.url]

This is the source code for the "Points Genie" site, created for the 57th promo of Engineering at UdeS

## Basics

To install, first install npm, nodejs@0.11 and mongodb then do

    npm install

You can run tests using

    npm tests

You can start the server in dev mode using two terminals

 - First: `npm run hot-dev-server`
 - Second: `npm start`


For production, make sure all the files are built using

    npm run build

Then run

    node --harmony server


[travis.img]: https://api.travis-ci.org/dozoisch/pointsgenie.svg
[travis.url]: https://travis-ci.org/dozoisch/pointsgenie
[deps.img]: https://david-dm.org/dozoisch/pointsgenie.svg
[deps.url]: https://david-dm.org/dozoisch/pointsgenie
[devdeps.img]: https://david-dm.org/dozoisch/pointsgenie/dev-status.svg
[devdeps.url]: https://david-dm.org/dozoisch/pointsgenie#info=devDependencies
[tasks.img]: https://badge.waffle.io/dozoisch/pointsgenie.svg?label=Current+Iteration&title=Current+Iteration
[tasks.url]: http://waffle.io/dozoisch/pointsgenie

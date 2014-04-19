# ExtendScript Plugin for Browserify

This plugin for Browserify allows you to target Adobe ExtendScript, which is essentially JavaScript run by Illustrator, InDesign, or Photoshop. ExtendScript has a non-JavaScript compliant method of loading modules and is not particularly friendly to npm, so Browserify is an easy way to bring CommonJS to that ecosystem.

Browserify is designed to interface with a Node-like or Browser-like ecosystem, particularly when it comes to global variables and ambient variables like `Number` and `Error`. ExtendScript does not provide these variables in an object like `global` or `window`, but magically makes them ambient. This plugin adjusts Browserify's globals to take advantage of this.

## Installation

    npm i browserify-extendscript

## Usage

If you use Browserify on the command line:

    browserify -p browserify-extendscript [...]

If you use Browserify in code:

    var bundler = browserify(); // as before
    bundler.plugin('browserify-extendscript');

    bundler.bundle(); // as before


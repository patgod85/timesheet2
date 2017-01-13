/*jshint node:true*/
/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
    const app = new EmberApp(defaults, {
        // Add options here
    });

    app.import('bower_components/bootstrap/dist/js/bootstrap.js');
    app.import('bower_components/bootstrap/dist/css/bootstrap.css');

    return app.toTree();
};

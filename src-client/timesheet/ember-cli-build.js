/*jshint node:true*/
/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');
const BroccoliMergeTrees = require('broccoli-merge-trees');

module.exports = function (defaults) {
    const app = new EmberApp(defaults, {
        minifyJS: {
            enabled: false
        },
        minifyCSS: {
            enabled: false
        },
        SRI: {
            enabled: false
        }
    });

    const bootstrapCss = new Funnel('bower_components', {
        srcDir: 'bootstrap/dist/css',
        files: ['bootstrap.css'],
        destDir: 'assets'
    });

    const githubImage = new Funnel('public', {
        srcDir: 'assets/images',
        files: ['github.png'],
        destDir: 'assets/images'
    });

    app.import('bower_components/bootstrap/dist/js/bootstrap.js');
    app.import('bower_components/bootstrap/dist/css/bootstrap.css');


    return new BroccoliMergeTrees([app.toTree(), bootstrapCss, githubImage]);
};

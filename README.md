BrainTuner (HTML5-Version)
=============================

This is the HTML5-Version of the Braintuner which was programmed in Adobe Flash.

## Translation 

Translation is done via a [Google Doc Spreadsheet](https://docs.google.com/spreadsheets/d/13rqYfXC3CAACf1FdkVgS18q9uI-JZ5dUT8HaII6dY84/).

## Deployments

Deployments made easy:

		make translation
		make deployment portal="onmeda.de" user=mkellershoff akamai=1 countdown=akamai

## Dev Requirements

Requirements for building the app:

`YTT`, `tty-countdown` and `akamaicli` are optional and just required by
the deployment script.

- [make](https://www.gnu.org/software/make/)
- [Jshon](http://kmkeen.com/jshon/)
- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [Minify](https://www.npmjs.com/package/node-minify)
- [YTT](https://apps.emkae.net/ytt/)
- [tty-countdown](https://github.com/veggiedefender/tty-countdown)
- [akamaibot/akamaicli](https://apps.emkae.net/akamaicli/)

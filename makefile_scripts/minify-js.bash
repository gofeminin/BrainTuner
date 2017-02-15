#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
minify dist/$portal/app.snippet.js > dist/$portal/app.snippet.min.js

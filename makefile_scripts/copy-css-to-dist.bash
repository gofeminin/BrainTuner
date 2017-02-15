#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
cp src/css/$portal/style.css dist/$portal/style.css

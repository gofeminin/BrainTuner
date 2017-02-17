#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
sass src/sass/$portal/style.sass > dist/$portal/style.css

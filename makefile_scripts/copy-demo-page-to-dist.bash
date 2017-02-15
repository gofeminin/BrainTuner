#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
cp src/html/$portal/demo.html dist/$portal/demo.html

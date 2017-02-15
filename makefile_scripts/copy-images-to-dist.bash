#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
cp src/images/$portal/* dist/$portal/images

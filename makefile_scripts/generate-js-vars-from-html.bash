#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
echo "var html_template=$(jshon -s "$(cat src/html/$portal/template.html)");" > tmp/var_html_template.js;

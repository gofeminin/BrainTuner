#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi

echo "(function( window, document ){" > dist/$portal/app.snippet.js
echo "\"use strict\";" >> dist/$portal/app.snippet.js
cat tmp/var_html_template.js >> dist/$portal/app.snippet.js
echo -n "var translation = " >> dist/$portal/app.snippet.js
cat src/json/translation/$portal.js >> dist/$portal/app.snippet.js
echo ";" >> dist/$portal/app.snippet.js
cat src/javascript/keys/$portal.js >> dist/$portal/app.snippet.js
cat src/javascript/YTT.js\
	src/javascript/UrlMap.js\
	src/javascript/UrlParamsMap.js\
	src/javascript/main.js\
	>> dist/$portal/app.snippet.js
echo "})( window, document );" >> dist/$portal/app.snippet.js

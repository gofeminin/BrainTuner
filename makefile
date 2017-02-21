all: info \
	distribution-directories\
	javascript-variables-from-html\
	javascript\
	minified-javascript\
	html\
	images\
	sass
info:
	bash makefile_scripts/print-info.bash
distribution-directories:
	bash makefile_scripts/prepare-dist.bash $portal
translation:
	bash makefile_scripts/download_and_generate_translation.bash $portal
javascript-variables-from-html:
	bash makefile_scripts/generate-js-vars-from-html.bash $portal
javascript:
	bash makefile_scripts/combine-js.bash $portal
minified-javascript:
	bash makefile_scripts/minify-js.bash $portal
html:
	bash makefile_scripts/copy-demo-page-to-dist.bash $portal
images:
	bash makefile_scripts/copy-images-to-dist.bash $portal
css:
	bash makefile_scripts/copy-css-to-dist.bash $portal
sass:
	bash makefile_scripts/generate-css-from-sass.bash $portal
deployment:
	bash makefile_scripts/deploy.bash $portal

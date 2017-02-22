#!/bin/bash
PARTIAL_DEPLOY_PATH="gehirntrainer"
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
if [[ -z $user ]]; then
	user="mkellershoff"
fi

case "$portal" in
	"onmeda.de")
		PARTIAL_DEPLOY_PATH="gehirntrainer"
		;;
	"onmeda.es")
		PARTIAL_DEPLOY_PATH="braintuner-onmeda-es"
		;;
	"onmeda.fr")
		PARTIAL_DEPLOY_PATH="braintuner-onmeda-fr"
		;;
	*)
		echo Nothing to do
		;;
esac
# uploading
scp -r dist/$portal/* $user@192.168.32.33:/www/admin.onmeda.de/GFX/$PARTIAL_DEPLOY_PATH/
# clear akamai cache
if [[ ! -z $akamai ]]; then
	cd ~/Apps/akamaibot
	AKAMAI_RES=$(java -jar akamaibot.jar purge\
	 http://i.onmeda.de/$PARTIAL_DEPLOY_PATH/app.snippet.js\
	 http://i.onmeda.de/$PARTIAL_DEPLOY_PATH/app.snippet.min.js\
	 http://i.onmeda.de/$PARTIAL_DEPLOY_PATH/style.css)
	echo $AKAMAI_RES
	# start tty-countdown
	if [[ ! -z $countdown ]]; then
		tty-countdown -s $(echo $AKAMAI_RES | jq .estimatedSeconds)
	fi
fi

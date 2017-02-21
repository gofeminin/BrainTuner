#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
# https://docs.google.com/spreadsheets/d/13rqYfXC3CAACf1FdkVgS18q9uI-JZ5dUT8HaII6dY84/edit#gid=0
GOOGLE_SPREADSHEET_ID="13rqYfXC3CAACf1FdkVgS18q9uI-JZ5dUT8HaII6dY84"
ytt $GOOGLE_SPREADSHEET_ID src/json/translation

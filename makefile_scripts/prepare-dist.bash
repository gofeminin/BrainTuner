#!/bin/bash
if [[ -z $portal ]]; then
	portal="onmeda.de"
fi
dist_dir="dist/$portal"
if [[ ! -d "$dist_dir" ]]; then
  mkdir $dist_dir
fi
if [[ ! -d "$dist_dir/images" ]]; then
  mkdir $dist_dir/images
fi


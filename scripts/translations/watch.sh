#!/usr/bin/env sh

chokidar "src/locales/**/*.json" -c "yarn translations:generate"

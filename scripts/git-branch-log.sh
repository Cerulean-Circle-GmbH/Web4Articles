#!/bin/bash

# Generate UTC timestamp in format YYYYMMDD-HHMMSS
UTC_TIMESTAMP=$(date -u +"%Y%m%d-%H%M%S")

# Create filename with UTC timestamp
FILENAME="git.${UTC_TIMESTAMP}.branch.log.ansi"

# Create temp directory if it doesn't exist
mkdir -p temp

# Generate pretty printed git log with colors and branch lines
git log --graph \
    --pretty=format:'%C(red)%h%C(reset) -%C(yellow)%d%C(reset) %C(white)%s%C(reset) %C(green)(%cr)%C(reset) %C(blue)<%an>%C(reset)' \
    --abbrev-commit \
    --all \
    --decorate \
    --color=always > "temp/${FILENAME}"

echo "Git log saved to: temp/${FILENAME}"
echo "File size: $(wc -l < temp/${FILENAME}) lines"

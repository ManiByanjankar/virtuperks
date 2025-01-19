#!/bin/bash

# Check if the correct number of arguments are passed
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <library>"
    exit 1
fi

# Assigning argument to variable
LIBRARY=$1

# Validate the library exists
if [ ! -d "libs/$LIBRARY" ]; then
    echo "Library '$LIBRARY' does not exist."
    exit 1
fi

# Path to the package.json of the library
PACKAGE_JSON="libs/$LIBRARY/package.json"

# Increment the version in package.json
if [ -f "$PACKAGE_JSON" ]; then
    echo "Incrementing version in $PACKAGE_JSON..."
    # Using jq to increment the patch version
    jq '.version |= (. | split(".") | .[0:2] + [(.[2] | tonumber + 1 | tostring)] | join("."))' "$PACKAGE_JSON" > "$PACKAGE_JSON.tmp" && mv "$PACKAGE_JSON.tmp" "$PACKAGE_JSON"
    echo "Updated version: $(jq -r '.version' "$PACKAGE_JSON")"
else
    echo "package.json not found in $PACKAGE_JSON"
    exit 1
fi

# Build the specified library
echo "Building the library: $LIBRARY..."
nx build "$LIBRARY"

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "Build failed for library: $LIBRARY"
    exit 1
fi

# Copy .npmrc to dist/libs/$LIBRARY
DIST_FOLDER="dist/libs/$LIBRARY"
NPMRC_FILE=".npmrc"
if [ -f "$NPMRC_FILE" ]; then
    echo "Copying .npmrc to $DIST_FOLDER..."
    cp "$NPMRC_FILE" "$DIST_FOLDER"
else
    echo ".npmrc file not found in the current directory."
    exit 1
fi

# Change to the dist folder and publish the package
echo "Publishing the library from $DIST_FOLDER..."
cd "$DIST_FOLDER" || exit 1
npm publish

# Check if publish was successful
if [ $? -eq 0 ]; then
    echo "Library '$LIBRARY' published successfully."
else
    echo "Failed to publish the library: $LIBRARY"
    exit 1
fi

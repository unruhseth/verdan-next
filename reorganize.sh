#!/bin/bash

cd nextjs-clerk-app/src/app

# Create new directory structure
mkdir -p "(auth)/(user)/my-apps"
mkdir -p "(auth)/(admin)/manage"
mkdir -p "(auth)/(master-admin)/system"

# Move user app routes
mv "(auth)/(account)/apps"/* "(auth)/(user)/my-apps/"
rm -rf "(auth)/(account)/apps"

# Move admin routes
mv "(auth)/(master-admin)/apps"/* "(auth)/(admin)/manage/"
rm -rf "(auth)/(master-admin)/apps"

# Keep public app routes in /apps
# They're already in the right place

echo "Route reorganization complete" 
#!/bin/bash

set -e

echo "🚀 Building Chrome Extension for Production..."

rm -rf dist/
rm -f surfai-extension.zip

npm run build

cp manifest.json dist/
cp -r icons dist/ 2>/dev/null || echo "No icons directory"

cd dist
zip -r ../surfai-extension.zip .
cd ..

echo "✅ Extension packaged: surfai-extension.zip"
echo "📦 Size: $(du -h surfai-extension.zip | cut -f1)"

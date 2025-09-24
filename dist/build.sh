#!/usr/bin/bash

echo "Building the project..."

if [ -d "app" ]; then
	rm -rf app
fi

echo "Building the app..."
mkdir app
cp Dockerfile entrypoint.sh app

cd app || exit

mkdir backend
cp ../../backend/app.py backend/
cp ../../backend/requirements.txt backend/
cp ../../backend/.env backend/
echo >> backend/requirements.txt
echo "gunicorn" >> backend/requirements.txt

mkdir frontend
cp -r ../../frontend/dist frontend/

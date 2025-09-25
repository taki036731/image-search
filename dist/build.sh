#!/usr/bin/bash

echo "Building the project..."

cd ../frontend && npm run build && cd -

if [ -d "app" ]; then
	rm -rf app
fi

echo "Building the app..."
mkdir app
cp Dockerfile entrypoint.sh app

cd app || exit

mkdir backend
cp -a ../../backend/lib backend/lib
cp ../../backend/app.py backend/
cp ../../backend/requirements.txt backend/
cp ../../backend/image-search-a9717-firebase-adminsdk-fbsvc-0a7f58bdd4.json backend/
echo FIREBASE_ADMIN_CREDENTIALS=image-search-a9717-firebase-adminsdk-fbsvc-0a7f58bdd4.json >> backend/.env
# cp ../../backend/.env backend/
echo >> backend/requirements.txt
echo "gunicorn" >> backend/requirements.txt

mkdir frontend
cp -r ../../frontend/dist frontend/

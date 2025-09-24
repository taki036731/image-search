#!/bin/bash

PORT=${PORT:-8080}
cd backend && exec gunicorn --bind "0.0.0.0:$PORT" --workers 1 --threads 8 "$@"
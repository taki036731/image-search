#!/bin/bash

PORT=${PORT:-8080}
cd /workspace/app/backend && exec gunicorn --bind "0.0.0.0:$PORT" --workers 1 --threads 8 "$@"
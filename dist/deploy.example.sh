#!/bin/sh

cd app && gcloud run deploy ${YOUR_APP_NAME} \
	--source . \
	--platform managed \
	--region asia-east1 \
	--allow-unauthenticated \
	--set-secrets GOOGLE_API_KEY=GOOGLE_API_KEY:latest,GOOGLE_CSE_ID=GOOGLE_CSE_ID:latest

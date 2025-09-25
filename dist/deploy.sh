#!/bin/sh

cd app && gcloud run deploy image-search \
	--source . \
	--platform managed \
	--region asia-northeast1 \
	--allow-unauthenticated \
	--set-secrets GOOGLE_API_KEY=GOOGLE_API_KEY:latest,GOOGLE_CSE_ID=GOOGLE_CSE_ID:latest

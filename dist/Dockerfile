FROM python:3.13-slim-trixie

WORKDIR /workspace/app
COPY . /workspace/app
RUN cd /workspace/app/backend && pip install --no-cache-dir -r /workspace/app/backend/requirements.txt
RUN chmod +x /workspace/app/entrypoint.sh

ENTRYPOINT ["/workspace/app/entrypoint.sh"]
CMD ["app:app"]
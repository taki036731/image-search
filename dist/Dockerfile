FROM python:3.13-slim-trixie

WORKDIR /app
COPY . /app
RUN cd /app/backend && pip install --no-cache-dir -r requirements.txt
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["app:app"]
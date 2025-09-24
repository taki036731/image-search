FROM python:3.13-slim-trixie

WORKDIR /app
COPY app /app
RUN cd /app/backend && pip install --no-cache-dir -r requirements.txt

CMD exec guniconrne --bind :$PORT --workers 1 --threads 8 app:app
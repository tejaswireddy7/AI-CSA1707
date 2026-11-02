FROM python:3.11-slim

WORKDIR /app

# opencv-python-headless bundles its own libs — no system OpenGL needed
# Only libglib2.0-0 is required for some glib dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        libglib2.0-0 \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 10000

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}

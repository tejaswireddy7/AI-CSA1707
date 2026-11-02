# ─────────────────────────────────────────────────────────────────────────────
# Road Damage AI – FastAPI Backend
# Optimised for Hugging Face Spaces (CPU Basic – 16 GB RAM, Free Tier)
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim

# System deps for OpenCV headless + Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
        libglib2.0-0 \
        libgl1-mesa-glx \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Install CPU-only PyTorch first (saves ~600 MB vs the default CUDA build) ──
RUN pip install --no-cache-dir \
        torch==2.3.1 \
        torchvision==0.18.1 \
        --index-url https://download.pytorch.org/whl/cpu

# ── Install the rest of the project requirements ──────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Copy application source ───────────────────────────────────────────────────
COPY . .

# Hugging Face Spaces expects the app to listen on port 7860
EXPOSE 7860

# Uvicorn start – single worker is fine for free CPU tier
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]

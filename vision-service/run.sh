#!/usr/bin/env bash
# Run inside WSL2 Ubuntu terminal from the project root:
#   cd /mnt/c/Users/IDS/e-commerce-automotive-store-temp-plate/vision-service
#   bash run.sh

set -e

echo "========================================"
echo "  AI Vision Microservice Setup (WSL2)"
echo "========================================"

if [ ! -d "venv" ]; then
    echo "[1/4] Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "[2/4] Activating virtual environment..."
source venv/bin/activate

echo "[3/4] Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "[4/4] Starting FastAPI server on port 8000..."
echo ""
echo "  Model: moondream2 (1.86B params)"
echo "  First run will download ~2 GB from HuggingFace."
echo "  Server: http://localhost:8000"
echo "  Health: http://localhost:8000/health"
echo "  API:    POST http://localhost:8000/analyze"
echo ""
python main.py

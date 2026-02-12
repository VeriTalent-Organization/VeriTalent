#!/usr/bin/env fish

# VeriTalent AI Service Startup Script

echo "🚀 Starting VeriTalent AI Service..."
echo ""

# Check if virtual environment exists
if not test -d .venv
    echo "❌ Virtual environment not found. Creating..."
    uv venv
end

# Activate virtual environment
source .venv/bin/activate.fish

# Check if dependencies are installed
if not test -f .venv/pyvenv.cfg
    echo "📦 Installing dependencies..."
    uv sync
end

# Check if .env.local file exists in parent directory
if not test -f ../.env.local
    echo "❌ .env.local file not found in project root"
    echo "Please create .env.local in /home/tife/VeriTalent/"
    exit 1
end

# Verify Azure credentials are set
set azure_endpoint (grep AZURE_AI_ENDPOINT ../.env.local | cut -d '=' -f2)
if test -z "$azure_endpoint"
    echo "❌ AZURE_AI_ENDPOINT not set in .env.local"
    echo "Please edit .env.local and add your Azure AI endpoint"
    exit 1
end

echo "✅ Environment configured (using ../.env.local)"
echo ""
echo "🤖 Starting AI service on http://localhost:8080"
echo "📝 Logs will appear below..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the service
uv run uvicorn src.main:app --reload --port 8080 --host 0.0.0.0

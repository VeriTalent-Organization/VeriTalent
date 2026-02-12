#!/usr/bin/env fish

# VeriTalent AI Demo - Quick Run Script
# This script runs the comprehensive AI demo for Jeffrey

echo "🚀 VeriTalent AI Demo Setup"
echo "================================"
echo ""

# Check if AI service is running
echo "🔍 Checking AI service status..."
set service_check (curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)

if test "$service_check" != "200"
    echo "❌ AI service is not running!"
    echo ""
    echo "Please start the AI service first:"
    echo "  cd /home/tife/VeriTalent/ai"
    echo "  ./start.fish"
    echo ""
    exit 1
end

echo "✅ AI service is running!"
echo ""

# Run the demo
echo "▶️  Starting comprehensive demo..."
echo "================================"
echo ""

uv run python demo_script.py

echo ""
echo "================================"
echo "✅ Demo completed!"
echo ""
echo "Next steps:"
echo "  - Review the output above"
echo "  - Show Jeffrey the real-time AI processing"
echo "  - Demonstrate specific endpoints in browser at http://localhost:8080/docs"

#!/bin/bash
# VHS Puzzles OpenCode Setup Script
# Run this once to set up everything

set -e

echo "=== VHS Puzzles OpenCode Setup ==="
echo ""

# Step 1: Install Ollama
echo "Step 1: Installing Ollama..."
if command -v ollama &> /dev/null; then
    echo "  ✓ Ollama already installed: $(ollama --version)"
else
    echo "  Installing via pacman..."
    sudo pacman -S ollama --noconfirm
    echo "  ✓ Ollama installed"
fi

echo ""

# Step 2: Pull recommended models
echo "Step 2: Pulling recommended models for RTX 2060 SUPER..."
echo "  This may take a few minutes on first run..."

ollama pull qwen2.5-coder:7b
echo "  ✓ qwen2.5-coder:7b ready"

ollama pull llama3.2:3b
echo "  ✓ llama3.2:3b ready"

echo ""

# Step 3: Install oh-my-openagent
echo "Step 3: Installing oh-my-openagent..."
echo "  (Non-interactive mode - no subscriptions)"

bunx oh-my-opencode install --no-tui --claude=no --gemini=no --copilot=no --openai=no --opencode-zen=no --opencode-go=no --zai-coding-plan=no

echo "  ✓ oh-my-openagent installed"

echo ""

# Step 4: Verify
echo "Step 4: Verification..."
echo "  OpenCode version: $(opencode --version)"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Restart your terminal (or exit/reopen opencode)"
echo "2. Run 'opencode' to start"
echo "3. Type '/help' or 'ultrawork' to begin"
echo ""
echo "For Ollama models to work, you may need to:"
echo "  - Ensure Ollama is running: 'ollama serve'"
echo "  - Or start Ollama service: 'systemctl --user enable --now ollama'"

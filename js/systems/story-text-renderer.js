/*
  // Story Text Renderer - robust, audited version
*/
class StoryTextRenderer {
  constructor() {
    this.currentText = '';
    this.targetText = '';
    this.typewriterIndex = 0;
    this.isTyping = false;
    this.timerDisplay = '';
    // Keep the typewriter/renderer refreshing for caret blink
    setInterval(() => this.renderStoryText(), 500);
  }

  wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = `bold ${fontSize}px "Courier New"`;
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      const metrics = ctx.measureText(test);
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) {lines.push(line);}
    return lines;
  }

  drawStoryText(ctx, width, height) {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Title (slightly larger, with terminal-style punctuation)
    const padding = height * 0.08;
    const contentHeight = height - padding * 2;
    const titleSizeBase = Math.min(contentHeight * 0.12, width * 0.08);
    const titleSize = Math.floor(titleSizeBase * 1.15);
    ctx.fillStyle = '#ff6b35';
    ctx.font = `bold ${titleSize}px "Courier New"`;
    ctx.textAlign = 'center';
    ctx.fillText(':: CASE FILE ::', width / 2, padding + titleSize);

    // Timer/Status area (upper portion, reserved for timer bar or countdown)
    const timerAreaY = padding + titleSize + titleSize * 0.8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(padding, timerAreaY - titleSize * 0.5, width - padding * 2, titleSize * 1.2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, timerAreaY - titleSize * 0.5, width - padding * 2, titleSize * 1.2);

    // Display timer text if available
    if (this.timerDisplay) {
      const timerSize = Math.min(titleSize * 0.8, width * 0.05);
      ctx.fillStyle = '#ff6b35';
      ctx.font = `bold ${timerSize}px "Courier New"`;
      ctx.textAlign = 'center';
      ctx.fillText(this.timerDisplay, width / 2, timerAreaY + timerSize * 0.3);
    }

    // Text body (center the block and left-align lines like a terminal)
    const textStartY = padding + titleSize + titleSize * 3;
    const maxWidth = Math.min(width * 0.8, width - padding * 2);
    const leftX = (width - maxWidth) / 2;
    const fontSize = Math.min((height - textStartY) * 0.32, width * 0.06);
    ctx.fillStyle = '#c8c8c8';
    ctx.font = `normal ${fontSize}px "Courier New"`;
    ctx.textAlign = 'left';
    const lines = this.wrapText(ctx, this.currentText, maxWidth, fontSize);
    const lineHeight = fontSize * 1.25;
    lines.forEach((line, i) => {
      if (line.trim()) {ctx.fillText(line, leftX, textStartY + i * lineHeight);}
    });

    // Caret / flashing character at end of typing sequence
    const lastLine = lines.length ? lines[lines.length - 1] : '';
    const caretVisible = Math.floor(Date.now() / 500) % 2 === 0;
    if (caretVisible) {
      const caretX = leftX + ctx.measureText(lastLine).width + 4;
      const caretY = textStartY + (lines.length - 1) * lineHeight;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(caretX, caretY - fontSize, 2, fontSize);
    }



    // Subtle monitor speckles
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.25})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
  }

  setText(text) {
    this.targetText = text;
    this.typewriterIndex = 0;
    this.currentText = '';
    this.isTyping = true;
    this.startTypewriter();
  }

  startTypewriter() {
    if (!this.isTyping) {return;}
    if (this.typewriterIndex < this.targetText.length) {
      this.currentText = this.targetText.substring(0, this.typewriterIndex + 1);
      this.typewriterIndex++;
      this.renderStoryText();
      setTimeout(() => this.startTypewriter(), 30);
    } else {
      this.isTyping = false;
    }
  }

  clearText() {
    this.currentText = '';
    this.targetText = '';
    this.typewriterIndex = 0;
    this.isTyping = false;
    this.timerDisplay = '';
    this.renderStoryText();
  }

  setTimer(displayText) {
    this.timerDisplay = displayText;
    this.renderStoryText();
  }

  renderStoryText() {
    const canvas = document.getElementById('story-text-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      this.drawStoryText(ctx, canvas.width, canvas.height);
    }
  }
}

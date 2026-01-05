/*
  // Story Text Renderer - robust, audited version
*/
class StoryTextRenderer {
  constructor() {
    this.currentText = '';
    this.targetText = '';
    this.typewriterIndex = 0;
    this.isTyping = false;
    this.currentQuote = '';
    this.lastQuoteChange = 0;
    this.quoteChangeInterval = 5000; // 5 seconds
    this.quotes = [
      'Well, look what just came across my desk...',
      'Another night, another puzzle. This should be interesting.',
      'The pieces are scattered, but I\'ll make sense of it all.',
      'Something doesn\'t add up. I need to find the connection.',
      'This looks like the work of a twisted mind.',
      'Let\'s see what secrets this puzzle hides.'
    ];
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
    if (line) lines.push(line);
    return lines;
  }

  drawStoryText(ctx, width, height) {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Title
    const padding = height * 0.08;
    const contentHeight = height - padding * 2;
    const titleSize = Math.min(contentHeight * 0.12, width * 0.08);
    ctx.fillStyle = '#ff6b35';
    ctx.font = `bold ${titleSize}px "Courier New"`;
    ctx.textAlign = 'center';
    ctx.fillText('CASE FILE', width / 2, padding + titleSize);

    // Text body
    const textStartY = padding + titleSize + titleSize * 1.2;
    const maxWidth = width - padding * 3;
    const fontSize = Math.min((height - textStartY) * 0.32, width * 0.07);
    const lines = this.wrapText(ctx, this.currentText, maxWidth, fontSize);
    ctx.fillStyle = '#c8c8c8';
    const lineHeight = fontSize * 1.25;
    lines.forEach((line, i) => {
      if (line.trim()) ctx.fillText(line, padding, textStartY + i * lineHeight);
    });



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
    if (!this.isTyping) return;
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

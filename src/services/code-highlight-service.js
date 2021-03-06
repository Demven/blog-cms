const RAINBOW_SRC = `/scripts/rainbow-js-css-html-shell-json.min.js`;

class CodeHighlightService {
  constructor() {
    this.loading = false;

    this.renderCode = this.renderCode.bind(this);
    this.loadRainbow = this.loadRainbow.bind(this);
    this.onRainbowLoaded = this.onRainbowLoaded.bind(this);
  }

  renderCode() {
    if (typeof window !== 'undefined') {
      const rainbow = window.Rainbow;

      if (rainbow) {
        rainbow.color();
      } else if (!this.loading) {
        this.loadRainbow();
      }
    }
  }

  loadRainbow() {
    this.loading = true;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = RAINBOW_SRC;
    script.onload = this.onRainbowLoaded;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  onRainbowLoaded() {
    this.loading = false;

    this.renderCode();
  }
}

export default new CodeHighlightService();

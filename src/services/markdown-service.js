class MarkdownFormatter {
  constructor (text) {
    this.output = text || '';

    this.formatSubscript = this.formatSubscript.bind(this);
    this.formatSuperscript = this.formatSuperscript.bind(this);
    this.formatLinks = this.formatLinks.bind(this);
    this.formatLineThrough = this.formatLineThrough.bind(this);
    this.formatUnderline = this.formatUnderline.bind(this);
    this.formatBold = this.formatBold.bind(this);
    this.formatCode = this.formatCode.bind(this);
    this.formatItalic = this.formatItalic.bind(this);
    this.toString = this.toString.bind(this);
  }

  format () {
    return this
      .formatSubscript()
      .formatSuperscript()
      .formatLineThrough()
      .formatUnderline()
      .formatBold()
      .formatItalic()
      .formatCode()
      .formatLinks()
      .toString();
  }

  formatSubscript () {
    this.output = this.output.replace(/\^\^(\d+)\^\^/g, '<sub>$1</sub>');
    return this;
  }

  formatSuperscript () {
    this.output = this.output.replace(/\^(\d+)\^/g, '<sup>$1</sup>');
    return this;
  }

  formatLinks () {
    this.output = this.output.replace(/\[([^\]]+)]\(([^(]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    return this;
  }

  formatLineThrough () {
    this.output = this.output.replace(/~~([^~]+)~~/g, '<span style="text-decoration: line-through">$1</span>');
    return this;
  }

  formatUnderline () {
    this.output = this.output.replace(/__([^_]+)__/g, '<span style="text-decoration: underline">$1</span>');
    return this;
  }

  formatBold () {
    this.output = this.output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return this;
  }

  formatCode () {
    this.output = this.output.replace(/`([^`]+)`/g, '<code>$1</code>');
    return this;
  }

  formatItalic () {
    this.output = this.output.replace(/_([^_]+)_/g, '<em>$1</em>');
    return this;
  }

  toString () {
    return this.output;
  }
}

export function formatMarkdown (text) {
  return new MarkdownFormatter(text).format();
}

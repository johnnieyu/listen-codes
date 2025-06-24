import React from 'react';

interface RichTextNode {
  type: 'text' | 'bold' | 'italic' | 'link' | 'linebreak' | 'ul' | 'ol' | 'li';
  content?: string;
  url?: string;
  children?: RichTextNode[];
}

function parseList(lines: string[]): RichTextNode[] {
  const nodes: RichTextNode[] = [];
  let i = 0;
  while (i < lines.length) {
    // Unordered list
    if (/^\s*[-*] /.test(lines[i])) {
      const items: RichTextNode[] = [];
      while (i < lines.length && /^\s*[-*] /.test(lines[i])) {
        const content = lines[i].replace(/^\s*[-*] /, '');
        items.push({ type: 'li', children: parseRichText(content) });
        i++;
      }
      nodes.push({ type: 'ul', children: items });
      continue;
    }
    // Ordered list
    if (/^\s*\d+\. /.test(lines[i])) {
      const items: RichTextNode[] = [];
      while (i < lines.length && /^\s*\d+\. /.test(lines[i])) {
        const content = lines[i].replace(/^\s*\d+\. /, '');
        items.push({ type: 'li', children: parseRichText(content) });
        i++;
      }
      nodes.push({ type: 'ol', children: items });
      continue;
    }
    // Not a list
    nodes.push(...parseRichText(lines[i]));
    i++;
  }
  return nodes;
}

export function parseRichText(text: string): RichTextNode[] {
  // Split by double newlines for paragraphs/lists
  const blocks = text.split(/\n{2,}/);
  let nodes: RichTextNode[] = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    // If block is a list, parse as list
    if (lines.some(line => /^\s*[-*] /.test(line) || /^\s*\d+\. /.test(line))) {
      nodes = nodes.concat(parseList(lines));
    } else {
      // Otherwise, treat as a paragraph
      const children = parseInlineRichText(block);
      if (children.length > 0) {
        nodes.push({ type: 'text', children });
      }
    }
    // Add linebreak between blocks (paragraphs/lists)
    nodes.push({ type: 'linebreak' });
  }
  // Remove last linebreak for cleaner output
  if (nodes.length && nodes[nodes.length - 1].type === 'linebreak') nodes.pop();
  return nodes;
}

function parseInlineRichText(text: string): RichTextNode[] {
  const nodes: RichTextNode[] = [];
  let currentIndex = 0;
  while (currentIndex < text.length) {
    // Bold (**text**)
    if (text.slice(currentIndex, currentIndex + 2) === '**') {
      const endIndex = text.indexOf('**', currentIndex + 2);
      if (endIndex !== -1) {
        const content = text.slice(currentIndex + 2, endIndex);
        nodes.push({ type: 'bold', children: parseInlineRichText(content) });
        currentIndex = endIndex + 2;
        continue;
      }
    }
    // Italic (*text*)
    if (text[currentIndex] === '*' && text[currentIndex - 1] !== '*') {
      const endIndex = text.indexOf('*', currentIndex + 1);
      if (endIndex !== -1 && text[endIndex - 1] !== '*') {
        const content = text.slice(currentIndex + 1, endIndex);
        nodes.push({ type: 'italic', children: parseInlineRichText(content) });
        currentIndex = endIndex + 1;
        continue;
      }
    }
    // Link [text](url)
    if (text[currentIndex] === '[') {
      const endBracket = text.indexOf(']', currentIndex);
      if (endBracket !== -1 && text.slice(endBracket + 1, endBracket + 2) === '(') {
        const endParen = text.indexOf(')', endBracket + 2);
        if (endParen !== -1) {
          const linkText = text.slice(currentIndex + 1, endBracket);
          const url = text.slice(endBracket + 2, endParen);
          nodes.push({ type: 'link', content: linkText, url });
          currentIndex = endParen + 1;
          continue;
        }
      }
    }
    // Regular text
    let textContent = '';
    while (currentIndex < text.length) {
      const char = text[currentIndex];
      // Check for special characters
      if (char === '*' || char === '[') break;
      textContent += char;
      currentIndex++;
    }
    if (textContent) {
      nodes.push({ type: 'text', content: textContent });
    }
  }
  return nodes;
}

export function renderRichText(nodes: RichTextNode[]): React.ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        if (node.children) {
          return (
            <p key={index} style={{ margin: 0, marginBottom: '1em' }}>
              {renderRichText(node.children)}
            </p>
          );
        }
        return <span key={index}>{node.content}</span>;
      case 'bold':
        return <strong key={index}>{node.children && renderRichText(node.children)}</strong>;
      case 'italic':
        return <em key={index}>{node.children && renderRichText(node.children)}</em>;
      case 'link':
        return (
          <a
            key={index}
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="update-link"
          >
            {node.content}
          </a>
        );
      case 'linebreak':
        return null;
      case 'ul':
        return <ul key={index} className="update-list">{node.children && renderRichText(node.children)}</ul>;
      case 'ol':
        return <ol key={index} className="update-list">{node.children && renderRichText(node.children)}</ol>;
      case 'li':
        return <li key={index}>{node.children && renderRichText(node.children)}</li>;
      default:
        return null;
    }
  });
} 
import re
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.in_style_or_script = False

    def handle_starttag(self, tag, attrs):
        if tag in ['style', 'script']:
            self.in_style_or_script = True
        # For layout readability, add a newline on block tags
        if tag in ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'br']:
            self.text_parts.append('\n')

    def handle_endtag(self, tag):
        if tag in ['style', 'script']:
            self.in_style_or_script = False
        if tag in ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']:
            self.text_parts.append('\n')

    def handle_data(self, data):
        if not self.in_style_or_script:
            text = data.strip()
            if text:
                self.text_parts.append(text + ' ')

def main():
    with open('/Users/nf/dev/20_AI_Concepts 2/20_AI_Concepts.html', 'r', encoding='utf-8') as f:
        html_content = f.read()

    parser = TextExtractor()
    parser.feed(html_content)
    text = ''.join(parser.text_parts)
    
    # Clean up multiple newlines
    text = re.sub(r'\n\s*\n+', '\n\n', text)

    with open('/Users/nf/dev/20_AI_Concepts 2/extracted_text.txt', 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    main()

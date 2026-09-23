"""
=============================================================================
 STANZA LATIN DEPENDENCY PARSER & LINEAR PHRASE CHUNKER
=============================================================================
 A Flask application providing a RESTful API for Stanza's Latin NLP models,
 serving a modern frontend that visualizes dependency trees and extracts 
 continuous linear phrase chunks using UPOS boundary triggers.
 
 Prerequisites:
 pip install stanza flask
 
 Execution:
 python app.py
=============================================================================
"""

import os
import sys
import logging
from flask import Flask, request, jsonify

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

try:
    import stanza
except ImportError:
    logging.error("CRITICAL: Stanza is not installed. Please run: pip install stanza flask")
    sys.exit(1)

app = Flask(__name__)

logging.info("Initializing Stanza Latin Universal Dependencies models...")
try:
    stanza.download('la', processors='tokenize,lemma,pos,depparse')
    nlp = stanza.Pipeline(lang='la', processors='tokenize,lemma,pos,depparse', use_gpu=False)
except Exception as e:
    logging.error(f"Failed to initialize Stanza models: {e}")
    sys.exit(1)

# =============================================================================
# EMBEDDED FRONTEND (HTML / CSS / JAVASCRIPT)
# =============================================================================
HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Latin Syntax Parser</title>
    <style>
        :root {
            --bg-color: #121212;
            --surface-color: #1e1e1e;
            --text-primary: #e0e0e0;
            --text-secondary: #a0a0a0;
            --accent-color: #4a90e2;
            --border-color: #333333;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
        }

        .container { max-width: 1000px; margin: 0 auto; }
        h1, h2 { font-weight: 500; color: #ffffff; margin-bottom: 0.5em; }
        
        h2 {
            font-size: 1.2rem; margin-top: 2rem;
            border-bottom: 1px solid var(--border-color); padding-bottom: 8px;
        }

        .input-section {
            background-color: var(--surface-color); padding: 20px;
            border-radius: 8px; border: 1px solid var(--border-color);
            margin-bottom: 30px;
        }

        textarea {
            width: 100%; background-color: var(--bg-color); color: var(--text-primary);
            border: 1px solid var(--border-color); border-radius: 4px; padding: 12px;
            font-family: inherit; font-size: 16px; box-sizing: border-box;
            resize: vertical; outline: none; transition: border-color 0.2s;
        }

        textarea:focus { border-color: var(--accent-color); }

        button {
            background-color: var(--accent-color); color: #ffffff; border: none;
            padding: 10px 20px; font-size: 16px; border-radius: 4px; cursor: pointer;
            margin-top: 15px; transition: background-color 0.2s;
        }
        button:hover { background-color: #357abd; }

        .loading-text { display: none; margin-left: 15px; color: var(--text-secondary); }
        .output-section { margin-top: 20px; }

        .sentence-block {
            margin-bottom: 40px; background-color: var(--surface-color);
            padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);
        }

        .tree-container { overflow-x: auto; padding-bottom: 20px; margin-bottom: 20px; }
        svg { display: block; }

        .phrase-list { list-style-type: none; padding: 0; margin: 0; }
        .phrase-list li {
            padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 16px;
        }
        .phrase-list li:last-child { border-bottom: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Latin Syntax Parser</h1>
        
        <div class="input-section">
            <textarea id="latin-input" rows="4">Gallia est omnis divisa in partes tres. Quo usque tandem abutere, Catilina, patientia nostra?</textarea>
            <div>
                <button onclick="parseText()">Parse Text</button>
                <span id="loading-indicator" class="loading-text">Processing...</span>
            </div>
        </div>

        <div id="results-container" class="output-section"></div>
    </div>

    <script>
        async function parseText() {
            const textInput = document.getElementById('latin-input').value;
            const container = document.getElementById('results-container');
            const loader = document.getElementById('loading-indicator');
            
            if (!textInput.trim()) return;

            container.innerHTML = '';
            loader.style.display = 'inline';

            try {
                const response = await fetch('/parse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: textInput })
                });
                
                const data = await response.json();
                loader.style.display = 'none';
                
                if (data.error) {
                    container.innerHTML = `<p style="color:#ff6b6b;">Error: ${data.error}</p>`;
                    return;
                }
                
                renderResults(data.sentences);
                
            } catch (e) {
                loader.style.display = 'none';
                container.innerHTML = `<p style="color:#ff6b6b;">Connection failed: ${e.message}</p>`;
            }
        }

        // ====================================================================
        // LINEAR UPOS CHUNKING LOGIC
        // Extracts contiguous reading phrases using Part-of-Speech triggers.
        // ====================================================================
        function extractPhrases(words) {
            const chunks = [];
            let currentChunk = [];

            words.forEach((word) => {
                // Determine if we should force a break BEFORE this word.
                const isPreposition = word.pos === 'ADP';
                const isSubordinator = word.pos === 'SCONJ';
                const isVocative = word.deprel === 'vocative';
                const isRelPronoun = word.pos === 'PRON' && word.lemma === 'qui';

                if ((isPreposition || isSubordinator || isVocative || isRelPronoun) && currentChunk.length > 0) {
                    chunks.push([...currentChunk]);
                    currentChunk = [];
                }

                currentChunk.push(word);

                // Determine if we should force a break AFTER this word.
                const isPunctuation = word.pos === 'PUNCT';
                if (isPunctuation) {
                    chunks.push([...currentChunk]);
                    currentChunk = [];
                }
            });

            // Push any remaining words in the buffer
            if (currentChunk.length > 0) {
                chunks.push(currentChunk);
            }

            // Map token objects back to strings and filter out empty arrays
            return chunks
                .map(chunk => chunk.map(w => w.text).join(' ').trim())
                .filter(text => text !== '');
        }

        // ====================================================================
        // RENDERING LOGIC
        // ====================================================================
        function renderResults(sentences) {
            const container = document.getElementById('results-container');
            const ns = "http://www.w3.org/2000/svg";

            sentences.forEach((words, idx) => {
                const block = document.createElement('div');
                block.className = 'sentence-block';

                // --- 1. RENDER DEPENDENCY TREE ---
                const treeTitle = document.createElement('h2');
                treeTitle.textContent = `Sentence ${idx + 1}: Dependency Tree`;
                block.appendChild(treeTitle);

                const treeContainer = document.createElement('div');
                treeContainer.className = 'tree-container';
                const svg = document.createElementNS(ns, "svg");
                
                const wordSpacing = 120;
                const padding = 60;
                const height = 250; 
                const width = words.length * wordSpacing + padding * 2;
                
                svg.setAttribute('width', width + "px");
                svg.setAttribute('height', height + "px");
                
                const defs = document.createElementNS(ns, "defs");
                const marker = document.createElementNS(ns, "marker");
                marker.setAttribute("id", `arrowhead-${idx}`);
                marker.setAttribute("markerWidth", "10");
                marker.setAttribute("markerHeight", "7");
                marker.setAttribute("refX", "9");
                marker.setAttribute("refY", "3.5");
                marker.setAttribute("orient", "auto");
                
                const polygon = document.createElementNS(ns, "polygon");
                polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
                polygon.setAttribute("fill", "#666666");
                
                marker.appendChild(polygon);
                defs.appendChild(marker);
                svg.appendChild(defs);

                const wordPositions = {};

                words.forEach((word, index) => {
                    const x = padding + index * wordSpacing;
                    const y = height - 30; 
                    wordPositions[word.id] = {x, y};
                    
                    const textElem = document.createElementNS(ns, 'text');
                    textElem.setAttribute('x', x);
                    textElem.setAttribute('y', y);
                    textElem.setAttribute('fill', '#e0e0e0');
                    textElem.setAttribute('text-anchor', 'middle');
                    textElem.textContent = word.text;
                    svg.appendChild(textElem);
                    
                    const posElem = document.createElementNS(ns, 'text');
                    posElem.setAttribute('x', x);
                    posElem.setAttribute('y', y + 20);
                    posElem.setAttribute('fill', '#a0a0a0');
                    posElem.setAttribute('text-anchor', 'middle');
                    posElem.setAttribute('font-size', '12px');
                    posElem.textContent = word.pos;
                    svg.appendChild(posElem);
                });

                words.forEach(word => {
                    if (word.head === 0) {
                        const target = wordPositions[word.id];
                        const path = document.createElementNS(ns, 'path');
                        path.setAttribute('d', `M ${target.x} ${target.y - 100} L ${target.x} ${target.y - 20}`);
                        path.setAttribute('stroke', '#4a90e2');
                        path.setAttribute('stroke-width', '2');
                        path.setAttribute('fill', 'none');
                        path.setAttribute("marker-end", `url(#arrowhead-${idx})`);
                        svg.appendChild(path);
                        
                        const label = document.createElementNS(ns, 'text');
                        label.setAttribute('x', target.x);
                        label.setAttribute('y', target.y - 110);
                        label.setAttribute('fill', '#4a90e2');
                        label.setAttribute('text-anchor', 'middle');
                        label.setAttribute('font-size', '12px');
                        label.textContent = "ROOT";
                        svg.appendChild(label);
                        
                    } else {
                        const sourceWord = words.find(w => w.id === word.head);
                        if (!sourceWord) return;
                        
                        const source = wordPositions[sourceWord.id];
                        const target = wordPositions[word.id];
                        const distance = Math.abs(source.x - target.x);
                        const midX = (source.x + target.x) / 2;
                        const controlY = target.y - 40 - (distance * 0.25); 
                        
                        const path = document.createElementNS(ns, 'path');
                        path.setAttribute('d', `M ${source.x} ${source.y - 20} Q ${midX} ${controlY} ${target.x} ${target.y - 20}`);
                        path.setAttribute('stroke', '#666666');
                        path.setAttribute('stroke-width', '1');
                        path.setAttribute('fill', 'none');
                        path.setAttribute("marker-end", `url(#arrowhead-${idx})`);
                        svg.appendChild(path);
                        
                        const label = document.createElementNS(ns, 'text');
                        label.setAttribute('x', midX);
                        label.setAttribute('y', controlY + (distance * 0.1)); 
                        label.setAttribute('fill', '#a0a0a0');
                        label.setAttribute('text-anchor', 'middle');
                        label.setAttribute('font-size', '11px');
                        label.textContent = word.deprel;
                        svg.appendChild(label);
                    }
                });
                
                treeContainer.appendChild(svg);
                block.appendChild(treeContainer);

                // --- 2. RENDER EXTRACTED PHRASES ---
                const phraseTitle = document.createElement('h2');
                phraseTitle.textContent = 'Extracted Phrases';
                block.appendChild(phraseTitle);

                const phrases = extractPhrases(words);
                const ul = document.createElement('ul');
                ul.className = 'phrase-list';
                
                phrases.forEach(phraseText => {
                    const li = document.createElement('li');
                    li.textContent = phraseText;
                    ul.appendChild(li);
                });
                
                block.appendChild(ul);
                container.appendChild(block);
            });
        }
    </script>
</body>
</html>
"""

# =============================================================================
# FLASK ROUTING
# =============================================================================

@app.route('/')
def index():
    return HTML_CONTENT

@app.route('/parse', methods=['POST'])
def parse():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text payload provided."}), 400
        
    try:
        doc = nlp(text)
        sentences_data = []
        for sentence in doc.sentences:
            words_data = []
            for word in sentence.words:
                words_data.append({
                    "id": word.id,
                    "text": word.text,
                    "lemma": word.lemma,
                    "pos": word.upos,
                    "head": word.head,
                    "deprel": word.deprel
                })
            sentences_data.append(words_data)
            
        return jsonify({"sentences": sentences_data})
        
    except Exception as e:
        logging.error(f"Parsing error: {str(e)}")
        return jsonify({"error": "An internal NLP engine error occurred."}), 500

if __name__ == '__main__':
    logging.info("Starting Latin NLP Web Server on http://127.0.0.1:5005")
    app.run(host='0.0.0.0', port=5005, debug=False)


window.openNotesDrawer = function (nodeId) {
    closeContextMenus();
    const node = findNodeByIdGlobal(currentHierarchy, nodeId);
    if (!node) return;

    const drawer = document.getElementById('notes-drawer');
    const title = document.getElementById('notes-drawer-title');
    const editorDiv = document.getElementById('notes-drawer-editor');

    if (drawer && title && editorDiv) {
        title.textContent = node.text || 'Node Notes';

        editorDiv.innerHTML = renderNotes(node.notes || '');

        editorDiv.setAttribute('data-node-id', nodeId);
        drawer.classList.add('open');

        setTimeout(() => editorDiv.focus(), 100);
    }
};

window.closeNotesDrawer = function () {
    const drawer = document.getElementById('notes-drawer');
    if (drawer) {
        drawer.classList.remove('open');
        const editorDiv = document.getElementById('notes-drawer-editor');
        if (editorDiv) editorDiv.blur();
    }
};

function renderNotes(text, citations = []) {
    if (!text) return '';
    let processed = escapeHtml(text);

    processed = processed.replace(/^#\s+(.*$)/gm, '<h1 style="margin: 0.5em 0; font-size: 1.5em; font-weight: bold;">$1</h1>');
    processed = processed.replace(/^##\s+(.*$)/gm, '<h2 style="margin: 0.5em 0; font-size: 1.3em; font-weight: bold;">$1</h2>');
    processed = processed.replace(/^###\s+(.*$)/gm, '<h3 style="margin: 0.5em 0; font-size: 1.1em; font-weight: bold;">$1</h3>');
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/__(.*?)__/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    processed = processed.replace(/_(.*?)_/g, '<em>$1</em>');
    processed = processed.replace(/^\s*-\s+(.*$)/gm, '<li>$1</li>');
    processed = processed.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 3px;">$1</code>');
    processed = processed.replace(/\n/g, '<br>');

    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    processed = processed.replace(urlRegex, (match) => {
        if (match.includes('"') || match.includes("'")) return match;
        const ytMatch = match.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);

        if (ytMatch && ytMatch[1]) {
            return `<a href="${match}" target="_blank">${match}</a><div class="yt-embed" contenteditable="false"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allowfullscreen></iframe></div>`;
        }
        return `<a href="${match}" target="_blank">${match}</a>`;
    });

    processed = processed.replace(/\[(\d+)\]/g, (match, num) => {
        const index = parseInt(num) - 1;
        if (citations && citations[index]) {
            const cit = citations[index];
            const title = escapeHtml(cit.title || '');
            const url = escapeHtml(cit.url || '');
            
            return `<span class="citation-dot" contenteditable="false" data-title="${title}" data-url="${url}" style="display:inline; white-space:nowrap;">` +
                   `<span style="display:inline-block; width:0; height:0; overflow:hidden; vertical-align:top;">[</span>` +
                   `<span style="cursor:pointer; font-weight:bold; font-size:0.8em; vertical-align:super; color:var(--accent-color, #007bff); padding:0 2px;">${num}</span>` +
                   `<span style="display:inline-block; width:0; height:0; overflow:hidden; vertical-align:top;">]</span>` +
                   `</span>`;
        }
        return match;
    });

    return processed;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getCursorOffset(root) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return { start: 0, end: 0 };
    const range = sel.getRangeAt(0);
    if (!root.contains(range.startContainer)) return { start: 0, end: 0 };

    const calc = (isStart) => {
        const targetContainer = isStart ? range.startContainer : range.endContainer;
        const targetOffset = isStart ? range.startOffset : range.endOffset;

        const pointRange = document.createRange();
        pointRange.setStart(targetContainer, targetOffset);
        pointRange.setEnd(targetContainer, targetOffset);

        let total = 0;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, null);
        let node;

        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node === targetContainer) {
                    total += targetOffset;
                    return total;
                }
                const nodeRange = document.createRange();
                nodeRange.selectNodeContents(node);
                if (pointRange.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0) {
                    total += node.nodeValue.length;
                }
            } else if (node.tagName === 'BR') {
                const nodeRange = document.createRange();
                nodeRange.selectNode(node);
                if (pointRange.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0) {
                    total += 1;
                }
            }
        }
        return total;
    };

    return { start: calc(true), end: calc(false) };
}

function setTextOffset(root, startOffset, endOffset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, null);
    let node;
    let current = 0;
    let startNode = null, startOff = 0, endNode = null, endOff = 0;
    let foundStart = false, foundEnd = false;

    function check(len, isBr) {
        if (!foundStart) {
            if (current + len >= startOffset) {
                if (isBr) {
                    if (startOffset === current) {
                        startNode = node.parentNode;
                        startOff = Array.prototype.indexOf.call(startNode.childNodes, node);
                        foundStart = true;
                    } else {
                        startNode = node.parentNode;
                        startOff = Array.prototype.indexOf.call(startNode.childNodes, node) + 1;
                        foundStart = true;
                    }
                } else {
                    startNode = node;
                    startOff = startOffset - current;
                    foundStart = true;
                }
            }
        }
        if (!foundEnd) {
            if (current + len >= endOffset) {
                if (isBr) {
                    if (endOffset === current) {
                        endNode = node.parentNode;
                        endOff = Array.prototype.indexOf.call(endNode.childNodes, node);
                        foundEnd = true;
                    } else {
                        endNode = node.parentNode;
                        endOff = Array.prototype.indexOf.call(endNode.childNodes, node) + 1;
                        foundEnd = true;
                    }
                } else {
                    endNode = node;
                    endOff = endOffset - current;
                    foundEnd = true;
                }
            }
        }
    }

    while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) {
            check(node.nodeValue.length, false);
            current += node.nodeValue.length;
        } else if (node.tagName === 'BR') {
            check(1, true);
            current += 1;
        }
        if (foundStart && foundEnd) break;
    }

    if (foundStart && foundEnd) {
        const range = document.createRange();
        range.setStart(startNode, startOff);
        range.setEnd(endNode, endOff);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function initNotesDrawer() {
    const closeBtn = document.getElementById('notes-drawer-close');
    const editorDiv = document.getElementById('notes-drawer-editor');

    if (closeBtn) {
        closeBtn.addEventListener('click', window.closeNotesDrawer);
    }

    if (editorDiv) {
        editorDiv.addEventListener('input', (e) => {
            const nodeId = e.target.getAttribute('data-node-id');
            const node = findNodeByIdGlobal(currentHierarchy, nodeId);

            if (node) {
                const val = e.target.innerText;

                const hadNotes = !!node.notes;
                if (val && val.trim().length > 0) {
                    node.notes = val;
                } else {
                    delete node.notes;
                }
                const hasNotes = !!node.notes;

                const { start: startOffset, end: endOffset } = getCursorOffset(e.target);

                e.target.innerHTML = renderNotes(val);

                setTextOffset(e.target, startOffset, endOffset);

                const json = __mmwComposeJsonWithCurrentSettings(currentHierarchy);
                editor.value = json;
                localStorage.setItem(localStorageKey, json);
                triggerAutoSave();

                if (hadNotes !== hasNotes) {
                    updateMindMap();
                }
            }
        });

        editorDiv.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                window.open(e.target.href, '_blank');
            }
        });
    }
}

function findNodeByIdGlobal(node, id) {
    if (node.id === id) return node;
    for (const child of node.children) {
        const found = findNodeByIdGlobal(child, id);
        if (found) return found;
    }
    return null;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotesDrawer);
} else {
    initNotesDrawer();
}

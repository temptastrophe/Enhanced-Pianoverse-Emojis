(function() {
    'use strict';

    var STORAGE_KEY = 'pianoverse_custom_emojis';

    function getCustomEmojis() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveCustomEmojis(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function addEmoji(emoji, container) {
        var el = document.createElement('div');
        el.className = 'emoji';
        el.dataset.name = emoji.name;
        el.dataset.id = emoji.id;
        el.dataset.animated = emoji.animated;

        var bg = document.createElement('div');
        bg.style.backgroundImage = 'url(' + emoji.url + ')';

        var img = document.createElement('img');
        img.src = emoji.url + (emoji.animated ? '?animated=true' : '');

        el.appendChild(bg);
        el.appendChild(img);

        el.addEventListener('click', function() {
            var input = document.querySelector('body > div > div.chat > pv-chat > div > input');
            if (!input) return;

            var text = '<' + (emoji.animated ? 'a' : '') + ':' + emoji.name + ':' + emoji.id + '>';
            var pos = input.selectionStart;
            input.value = input.value.slice(0, pos) + text + input.value.slice(pos);
            var newPos = pos + text.length;
            input.setSelectionRange(newPos, newPos);
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        container.appendChild(el);
    }

    function addCustomEmojiControls(popup, container) {
        var wrap = document.createElement('div');
        wrap.style.padding = '10px';
        wrap.style.borderTop = '1px solid rgba(255,255,255,0.08)';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.gap = '6px';

        var title = document.createElement('div');
        title.textContent = 'Custom Emojis';
        title.style.fontSize = '13px';
        title.style.fontWeight = '600';
        title.style.marginBottom = '2px';

        var nameInput = document.createElement('input');
        nameInput.placeholder = 'Emoji name';

        var idInput = document.createElement('input');
        idInput.placeholder = 'Emoji ID';

        var urlInput = document.createElement('input');
        urlInput.placeholder = 'Emoji URL';

        var animLabel = document.createElement('label');
        animLabel.style.display = 'flex';
        animLabel.style.alignItems = 'center';
        animLabel.style.gap = '6px';
        animLabel.style.fontSize = '12px';
        animLabel.style.cursor = 'pointer';

        var animCheck = document.createElement('input');
        animCheck.type = 'checkbox';
        animLabel.appendChild(animCheck);
        animLabel.appendChild(document.createTextNode('Animated'));

        var addBtn = document.createElement('button');
        addBtn.textContent = 'Add Emoji';

        var status = document.createElement('div');
        status.style.fontSize = '11px';
        status.style.opacity = '0.6';
        status.style.minHeight = '14px';

        addBtn.addEventListener('click', function() {
            var n = nameInput.value.trim();
            var i = idInput.value.trim();
            var u = urlInput.value.trim();

            if (!n || !i || !u) {
                status.textContent = 'Please fill in every field';
                return;
            }

            var emoji = {
                name: n,
                id: i,
                url: u,
                animated: animCheck.checked
            };

            var list = getCustomEmojis();
            list.push(emoji);
            saveCustomEmojis(list);
            addEmoji(emoji, container);

            nameInput.value = '';
            idInput.value = '';
            urlInput.value = '';
            animCheck.checked = false;
            status.textContent = 'Emoji saved';
        });

        var clearBtn = document.createElement('button');
        clearBtn.textContent = 'Delete Custom Emojis';
        clearBtn.addEventListener('click', function() {
            if (!confirm('Delete all custom emojis?')) return;
            localStorage.removeItem(STORAGE_KEY);
            container.innerHTML = '';
            status.textContent = 'Custom emojis deleted';
        });

        wrap.appendChild(title);
        wrap.appendChild(nameInput);
        wrap.appendChild(idInput);
        wrap.appendChild(urlInput);
        wrap.appendChild(animLabel);
        wrap.appendChild(addBtn);
        wrap.appendChild(clearBtn);
        wrap.appendChild(status);
        popup.appendChild(wrap);
    }

    function addFooter(popup) {
        var foot = document.createElement('div');
        foot.textContent = 'Enhanced by Temptastrophe\nOriginally made by Enzoenbrrr';
        foot.style.padding = '10px';
        foot.style.textAlign = 'center';
        foot.style.fontSize = '10px';
        foot.style.lineHeight = '1.5';
        foot.style.opacity = '0.45';
        foot.style.borderTop = '1px solid rgba(255,255,255,0.08)';
        foot.style.whiteSpace = 'pre-line';
        popup.appendChild(foot);
    }

    // button + toggle
    (function() {
        var btn = document.createElement('i');
        btn.classList.add('fa-solid', 'fa-face-laugh');

        var open = false;

        btn.style.cssText = 'display:flex;align-items:center;justify-content:center;margin-right:max(0.7vw,8px);cursor:url(/assets/pointer-BCNK29s4.cur),auto;opacity:0.4;transition:opacity 0.15s ease;user-select:none;-webkit-user-select:none;';

        function setOpacity() {
            if (open) {
                btn.style.opacity = '1';
            } else {
                btn.style.opacity = (btn.dataset.hovering === 'true') ? '1' : '0.4';
            }
        }

        btn.addEventListener('mouseenter', function() {
            btn.dataset.hovering = 'true';
            setOpacity();
        });
        btn.addEventListener('mouseleave', function() {
            btn.dataset.hovering = 'false';
            setOpacity();
        });

        btn.addEventListener('click', function(e) {
            if (e.target.closest('.popup-root')) return;

            open = !open;
            btn.classList.toggle('fa-xmark', open);
            btn.classList.toggle('fa-face-laugh', !open);

            var popup = btn.querySelector('.popup-root');
            if (!popup) return;
            popup.style.display = open ? 'flex' : 'none';
            setOpacity();
        });

        var chatBar = document.querySelector('body > div > div.chat > pv-chat > div');
        if (!chatBar) {
            console.warn('Emoji button container not found');
            return;
        }
        chatBar.insertBefore(btn, chatBar.firstChild);
    })();

    // load everything
    (async function() {
        var btn = document.querySelector('i.fa-face-laugh');
        if (!btn) {
            console.warn('Emoji button not found');
            return;
        }

        try {
            var htmlRes = await fetch('https://raw.githubusercontent.com/enzoenbrrr/pianoverse-emojis/refs/heads/main/src/index.html');
            if (!htmlRes.ok) throw new Error('Failed to load emoji container');
            btn.innerHTML = await htmlRes.text();

            var scriptRes = await fetch('https://raw.githubusercontent.com/enzoenbrrr/pianoverse-emojis/refs/heads/main/src/script.js');
            if (!scriptRes.ok) throw new Error('Failed to load emoji script');
            eval(await scriptRes.text());

            var jsonRes = await fetch('https://raw.githubusercontent.com/enzoenbrrr/pianoverse-emojis/refs/heads/main/emojis.json');
            if (!jsonRes.ok) throw new Error('Failed to load emojis');
            var emojis = await jsonRes.json();

            for (var cat in emojis) {
                var catEl = document.getElementById(cat);
                if (!catEl) continue;
                for (var j = 0; j < emojis[cat].length; j++) {
                    addEmoji(emojis[cat][j], catEl);
                }
            }

            var customCat = document.getElementById('custom');
            if (!customCat) {
                customCat = document.createElement('div');
                customCat.id = 'custom';
                customCat.classList.add('emoji-category');
                btn.appendChild(customCat);
            }

            var customs = getCustomEmojis();
            for (var k = 0; k < customs.length; k++) {
                addEmoji(customs[k], customCat);
            }

            var popup = btn.querySelector('.popup-root');
            if (popup) {
                addCustomEmojiControls(popup, customCat);
                addFooter(popup);
            }
        } catch (err) {
            console.error('Error loading emojis:', err);
        }
    })();
})();

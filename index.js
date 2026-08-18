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

    function insertEmojiText(emoji) {
        var input = document.querySelector('body > div > div.chat > pv-chat > div > input');
        if (!input) return;

        var text = '<' + (emoji.animated ? 'a' : '') + ':' + emoji.name + ':' + emoji.id + '>';
        var pos = input.selectionStart;
        input.value = input.value.slice(0, pos) + text + input.value.slice(pos);
        var newPos = pos + text.length;
        input.setSelectionRange(newPos, newPos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function makeEmojiEl(emoji) {
        var el = document.createElement('div');
        el.className = 'emoji';
        el.dataset.name = emoji.name;
        el.dataset.id = emoji.id;
        el.dataset.animated = emoji.animated;
        el.style.cssText = 'position:relative;width:2.5rem;height:2.5rem;border-radius:0.7rem;overflow:hidden;cursor:pointer;display:inline-block;margin:4px;';

        var bg = document.createElement('div');
        bg.style.cssText = 'position:absolute;inset:0;background-size:cover;background-position:center;opacity:0.3;';
        bg.style.backgroundImage = 'url(' + emoji.url + ')';

        var img = document.createElement('img');
        img.src = emoji.url + (emoji.animated ? '?animated=true' : '');
        img.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1.8rem;height:1.8rem;border-radius:0.5rem;';

        el.appendChild(bg);
        el.appendChild(img);

        el.addEventListener('click', function() {
            insertEmojiText(emoji);
        });

        return el;
    }

    // original face button
    (function() {
        var btn = document.createElement('i');
        btn.classList.add('fa-solid', 'fa-face-laugh');

        var open = false;

        btn.style.cssText = 'display:flex;align-items:center;justify-content:center;margin-right:max(0.7vw,8px);cursor:url(/assets/pointer-BCNK29s4.cur),auto;opacity:0.4;transition:opacity 0.15s ease;user-select:none;-webkit-user-select:none;';

        function setOpacity() {
            btn.style.opacity = open || btn.dataset.hovering === 'true' ? '1' : '0.4';
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
            if (popup) popup.style.display = open ? 'flex' : 'none';
            setOpacity();
        });

        var chatBar = document.querySelector('body > div > div.chat > pv-chat > div');
        if (!chatBar) {
            console.warn('Emoji button container not found');
            return;
        }
        chatBar.insertBefore(btn, chatBar.firstChild);
    })();

    // the + button for customs
    (function() {
        var plusBtn = document.createElement('i');
        plusBtn.classList.add('fa-solid', 'fa-plus');
        plusBtn.title = 'Custom Emojis';

        var open = false;

        plusBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;margin-right:max(0.5vw,6px);cursor:url(/assets/pointer-BCNK29s4.cur),auto;opacity:0.4;transition:opacity 0.15s ease;user-select:none;-webkit-user-select:none;font-size:0.95em;';

        function setOpacity() {
            plusBtn.style.opacity = open || plusBtn.dataset.hovering === 'true' ? '1' : '0.4';
        }

        plusBtn.addEventListener('mouseenter', function() {
            plusBtn.dataset.hovering = 'true';
            setOpacity();
        });
        plusBtn.addEventListener('mouseleave', function() {
            plusBtn.dataset.hovering = 'false';
            setOpacity();
        });

        var popup = document.createElement('div');
        popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:260px;background:rgba(20,20,20,0.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:14px;display:none;flex-direction:column;gap:8px;z-index:99999;box-shadow:0 12px 40px rgba(0,0,0,0.5);';

        var title = document.createElement('div');
        title.textContent = 'Custom Emojis';
        title.style.cssText = 'font-size:13px;font-weight:600;text-align:center;margin-bottom:4px;';

        var nameInput = document.createElement('input');
        nameInput.placeholder = 'Emoji name';
        nameInput.style.cssText = 'width:100%;padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.08);color:#fff;font-size:12px;box-sizing:border-box;';

        var idInput = document.createElement('input');
        idInput.placeholder = 'Emoji ID';
        idInput.style.cssText = nameInput.style.cssText;

        var urlInput = document.createElement('input');
        urlInput.placeholder = 'Emoji URL';
        urlInput.style.cssText = nameInput.style.cssText;

        var animLabel = document.createElement('label');
        animLabel.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;user-select:none;';
        var animCheck = document.createElement('input');
        animCheck.type = 'checkbox';
        animLabel.appendChild(animCheck);
        animLabel.appendChild(document.createTextNode('Animated'));

        var addBtn = document.createElement('button');
        addBtn.textContent = 'Add Emoji';
        addBtn.style.cssText = 'padding:7px;border:none;border-radius:6px;background:rgba(255,255,255,0.12);color:#fff;font-size:12px;cursor:pointer;';

        var status = document.createElement('div');
        status.style.cssText = 'font-size:11px;opacity:0.6;min-height:14px;text-align:center;';

        var listWrap = document.createElement('div');
        listWrap.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;max-height:140px;overflow-y:auto;gap:2px;margin:4px 0;';

        var clearBtn = document.createElement('button');
        clearBtn.textContent = 'Delete All Custom';
        clearBtn.style.cssText = 'padding:6px;border:none;border-radius:6px;background:rgba(180,40,40,0.3);color:#fff;font-size:11px;cursor:pointer;';

        var foot = document.createElement('div');
        foot.textContent = 'Enhanced by Temptastrophe\nOriginally made by Enzoenbrrr';
        foot.style.cssText = 'font-size:9px;opacity:0.4;text-align:center;line-height:1.4;white-space:pre-line;margin-top:4px;';

        popup.appendChild(title);
        popup.appendChild(nameInput);
        popup.appendChild(idInput);
        popup.appendChild(urlInput);
        popup.appendChild(animLabel);
        popup.appendChild(addBtn);
        popup.appendChild(status);
        popup.appendChild(listWrap);
        popup.appendChild(clearBtn);
        popup.appendChild(foot);

        // put popup on body so fixed positioning works cleanly
        document.body.appendChild(popup);

        function refreshList() {
            listWrap.innerHTML = '';
            var list = getCustomEmojis();
            for (var i = 0; i < list.length; i++) {
                listWrap.appendChild(makeEmojiEl(list[i]));
            }
        }

        addBtn.addEventListener('click', function() {
            var n = nameInput.value.trim();
            var i = idInput.value.trim();
            var u = urlInput.value.trim();
            if (!n || !i || !u) {
                status.textContent = 'Fill every field';
                return;
            }
            var emoji = { name: n, id: i, url: u, animated: animCheck.checked };
            var list = getCustomEmojis();
            list.push(emoji);
            saveCustomEmojis(list);
            refreshList();
            nameInput.value = '';
            idInput.value = '';
            urlInput.value = '';
            animCheck.checked = false;
            status.textContent = 'Saved';
        });

        clearBtn.addEventListener('click', function() {
            if (!confirm('Delete all custom emojis?')) return;
            localStorage.removeItem(STORAGE_KEY);
            refreshList();
            status.textContent = 'Cleared';
        });

        plusBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            open = !open;
            popup.style.display = open ? 'flex' : 'none';
            setOpacity();
            if (open) refreshList();
        });

        document.addEventListener('click', function(e) {
            if (open && !popup.contains(e.target) && e.target !== plusBtn) {
                open = false;
                popup.style.display = 'none';
                setOpacity();
            }
        });

        var chatBar = document.querySelector('body > div > div.chat > pv-chat > div');
        if (!chatBar) return;

        var faceBtn = chatBar.querySelector('i.fa-face-laugh');
        if (faceBtn) {
            chatBar.insertBefore(plusBtn, faceBtn.nextSibling);
        } else {
            chatBar.insertBefore(plusBtn, chatBar.firstChild);
        }
    })();

    // load original picker
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
                    var emoji = emojis[cat][j];
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

                    el.addEventListener('click', function(em) {
                        return function() {
                            insertEmojiText(em);
                        };
                    }(emoji));

                    catEl.appendChild(el);
                }
            }
        } catch (err) {
            console.error('Error loading emojis:', err);
        }
    })();
})();

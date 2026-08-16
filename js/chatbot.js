(function() {
  function initChatbot() {
    document.querySelectorAll("video.chat__avatar[data-src]").forEach((e) => {
      e.src = e.dataset.src;
      e.play().catch(() => {});
    });

    const chatContainer = document.getElementById('chat');
    const chatToggle = document.getElementById('chat-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatBadge = document.getElementById('chat-badge');
    const chatTeaser = document.getElementById('chat-teaser');

    if (!chatContainer || !chatToggle || !chatPanel || !chatLog || !chatForm || !chatInput || !chatSubmit) {
      return;
    }

    let isOpen = false;
    let isDragging = false;
    let messages = [];
    let leadSent = sessionStorage.getItem('chatLeadSent') === '1';

    // Virtual Keyboard / Safe Area handler for mobile
    function adjustForMobile() {
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
          if (isOpen && window.innerWidth <= 860) {
            chatPanel.style.bottom = Math.max(0, window.innerHeight - window.visualViewport.height) + 'px';
            chatPanel.style.height = window.visualViewport.height + 'px';
            chatLog.scrollTop = chatLog.scrollHeight;
          }
        });
      }
    }
    adjustForMobile();

    // A11y ARIA Live Region setup
    chatLog.setAttribute('aria-live', 'polite');
    chatLog.setAttribute('aria-atomic', 'false');
    chatLog.setAttribute('role', 'log');

    // DOM safe message creation
    function appendMessage(content, sender = 'sys') {
      const msgDiv = document.createElement('div');
      msgDiv.className = `msg msg--${sender}`;
      
      if (sender === 'sys') {
        // Safe markdown-like parsing without innerHTML
        const parts = String(content).split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\n)/g);
        parts.forEach(part => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const strong = document.createElement('strong');
            strong.textContent = part.slice(2, -2);
            msgDiv.appendChild(strong);
          } else if (part.startsWith('*') && part.endsWith('*')) {
            const em = document.createElement('em');
            em.textContent = part.slice(1, -1);
            msgDiv.appendChild(em);
          } else if (part.startsWith('`') && part.endsWith('`')) {
            const code = document.createElement('code');
            code.textContent = part.slice(1, -1);
            msgDiv.appendChild(code);
          } else if (part === '\n') {
            msgDiv.appendChild(document.createElement('br'));
          } else if (part) {
            msgDiv.appendChild(document.createTextNode(part));
          }
        });
      } else {
        msgDiv.textContent = content;
      }
      
      chatLog.appendChild(msgDiv);
      chatLog.scrollTop = chatLog.scrollHeight;

      // Save state
      saveState();

      return msgDiv;
    }

    // Révélation "machine à écrire" — purement visuelle, sur un message DÉJÀ
    // construit et sauvegardé correctement par appendMessage() ci-dessus (ne
    // touche ni au state ni au parsing markdown : parcourt juste les noeuds
    // texte déjà en place dans l'ordre du document et les remplit
    // progressivement). Le serveur ne stream pas (le tag [LEAD] doit être lu
    // en entier avant l'envoi) ; ceci donne la fluidité perçue sans y toucher.
    function revealTyping(msgDiv) {
      if (!msgDiv) return;
      const walker = document.createTreeWalker(msgDiv, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let n;
      while ((n = walker.nextNode())) nodes.push(n);
      const fulls = nodes.map((node) => node.textContent);
      nodes.forEach((node) => { node.textContent = ''; });

      const totalChars = fulls.reduce((a, s) => a + s.length, 0);
      if (!totalChars) return;
      const stepChars = Math.max(2, Math.round(totalChars / 45));
      let ni = 0;
      const timer = setInterval(() => {
        let remaining = stepChars;
        while (remaining > 0 && ni < nodes.length) {
          const full = fulls[ni];
          const have = nodes[ni].textContent.length;
          const take = Math.min(remaining, full.length - have);
          nodes[ni].textContent += full.slice(have, have + take);
          remaining -= take;
          if (nodes[ni].textContent.length >= full.length) ni++;
        }
        chatLog.scrollTop = chatLog.scrollHeight;
        if (ni >= nodes.length) clearInterval(timer);
      }, 20);
    }

    function showTyping() {
      const typingIndicator = document.createElement('div');
      typingIndicator.id = 'typing-indicator';
      typingIndicator.className = 'msg msg--sys chat__typing';
      for (let i = 0; i < 3; i++) {
        typingIndicator.appendChild(document.createElement('span'));
      }
      chatLog.appendChild(typingIndicator);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    function removeTyping() {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();
    }

    // Load State
    function loadState() {
      try {
        const saved = sessionStorage.getItem('octomask_messages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            messages = parsed;
            // Re-render
            chatLog.innerHTML = '';
            messages.forEach(msg => {
              appendMessage(msg.text, msg.role === 'user' ? 'usr' : 'sys');
            });
            return true;
          }
        }
      } catch (e) { console.error('Error loading chat state', e); }
      return false;
    }

    // Save State
    function saveState() {
      try {
        sessionStorage.setItem('octomask_messages', JSON.stringify(messages));
      } catch (e) {}
    }

    // Fallback UI
    function handleApiError() {
      removeTyping();
      appendMessage("Désolé, je rencontre un problème réseau ou l'IA est trop sollicitée.", 'sys');
      
      const fallbackBtn = document.createElement('a');
      fallbackBtn.href = 'mailto:contact@purity-agency.be';
      fallbackBtn.className = 'btn btn--accent chat__meet-btn';
      fallbackBtn.style.marginTop = '10px';
      fallbackBtn.style.display = 'inline-block';
      fallbackBtn.textContent = 'Nous contacter par email';
      
      const wrapper = document.createElement('div');
      wrapper.appendChild(fallbackBtn);
      chatLog.appendChild(wrapper);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    async function handleSubmit(e) {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      
      if (text.length > 500) {
        alert("Votre message est trop long.");
        return;
      }

      appendMessage(text, 'usr');
      chatInput.value = '';
      chatInput.disabled = true;
      chatSubmit.disabled = true;
      
      messages.push({ role: 'user', text });
      showTyping();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        removeTyping();
        
        if (data.reply) {
          let replyText = data.reply;
          const leadMatch = replyText.match(/\[LEAD\]\s*(\{[\s\S]*?\})\s*\[\/LEAD\]/i);
          
          if (leadMatch) {
            replyText = replyText.replace(/\[LEAD\][\s\S]*?\[\/LEAD\]/i, '').trim();
            try {
              const leadData = JSON.parse(leadMatch[1]);
              if (!leadSent && leadData && (leadData.email || leadData.phone) && leadData.name) {
                leadSent = true;
                sessionStorage.setItem('chatLeadSent', '1');
                fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: leadData.name || '',
                    email: leadData.email || '',
                    phone: leadData.phone || '',
                    activity: leadData.activity || '',
                    need: (leadData.need || '') + ' [via chatbot OctoMask]'
                  })
                }).catch(() => {});
              }
            } catch (e) {}
          }
          
          if (replyText) {
            revealTyping(appendMessage(replyText, 'sys'));
            messages.push({ role: 'model', text: replyText });
            if (messages.length > 20) messages = messages.slice(-20);
            saveState();
          }
        } else {
          handleApiError();
        }
      } catch (err) {
        handleApiError();
      }
      
      chatInput.disabled = false;
      chatSubmit.disabled = false;
      // Note: Focus disabled on mobile to prevent virtual keyboard annoyance
      if (window.innerWidth > 860) {
        chatInput.focus();
      }
    }

    chatForm.addEventListener('submit', handleSubmit);

    // Suggestions handling
    document.querySelectorAll('.chat__chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query && chatInput && chatForm) {
          chatInput.value = query;
          chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      });
    });

    // Toggle Chat
    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        if (chatBadge) {
          chatBadge.hidden = true;
          try { sessionStorage.setItem('octomask_badge_seen', '1'); } catch (e) {}
        }
        if (chatTeaser) {
          chatTeaser.hidden = true;
        }
        
        chatContainer.classList.add('is-open');
        chatPanel.removeAttribute('hidden');
        chatPanel.classList.add('is-entering');
        chatToggle.setAttribute('aria-expanded', 'true');
        
        requestAnimationFrame(() => {
          chatPanel.classList.remove('is-entering');
          chatPanel.classList.add('is-active');
        });

        // Initialize state or intro message
        if (messages.length === 0) {
          if (!loadState()) {
            setTimeout(() => {
              const intro = "Bonjour ! 👋 Je filtre les premières demandes pour l'équipe Purity. Pour aller droit au but et vous faire gagner du temps : quel est le principal frein de votre activité aujourd'hui ?";
              revealTyping(appendMessage(intro, 'sys'));
              messages.push({ role: 'model', text: intro });
              saveState();
              
              const suggestions = [
                "Je perds des appels quand je travaille",
                "J'ai trop de RDV oubliés (no-shows)",
                "On ne me trouve pas bien sur Google",
                "Je veux (re)faire mon site web"
              ];
              const suggContainer = document.createElement('div');
              suggContainer.className = 'chat__suggestions';
              suggestions.forEach((s, idx) => {
                const btn = document.createElement('button');
                btn.className = 'chat__suggestion-btn';
                btn.textContent = s;
                btn.style.animationDelay = (0.1 * idx) + 's';
                btn.onclick = () => {
                  suggContainer.remove();
                  chatInput.value = s;
                  chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                };
                suggContainer.appendChild(btn);
              });
              chatLog.appendChild(suggContainer);
              chatLog.scrollTop = chatLog.scrollHeight;
            }, 400);
          }
        }
        
        if (window.innerWidth > 860) {
          setTimeout(() => chatInput.focus(), 500);
        }
      } else {
        chatContainer.classList.remove('is-open');
        chatPanel.classList.remove('is-active');
        chatPanel.classList.add('is-entering');
        chatToggle.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
          chatPanel.setAttribute('hidden', '');
        }, 300);
      }
    }

    // A11y Focus trap and Esc to close
    chatPanel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat();
        chatToggle.focus();
      }
    });

    if (chatBadge) {
      try {
        if (sessionStorage.getItem('octomask_badge_seen')) chatBadge.hidden = true;
      } catch (e) {}
    }

    if (chatTeaser) {
      const teaserClose = chatTeaser.querySelector('.chat__teaser-close');
      if (teaserClose) {
        teaserClose.addEventListener('click', (e) => {
          e.stopPropagation();
          chatTeaser.hidden = true;
        });
      }
      setTimeout(() => {
        if (!isOpen && !chatBadge.hidden) {
          chatTeaser.removeAttribute('hidden');
          chatTeaser.classList.add('is-visible');
        }
      }, 5000);
    }

    // Drag logic for desktop
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
    
    function startDrag(e) {
      if (window.innerWidth <= 860) return; // Disable drag on mobile
      const evt = e.touches ? e.touches[0] : e;
      isDragging = false;
      startX = evt.clientX;
      startY = evt.clientY;
      const rect = chatContainer.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('touchend', stopDrag);
    }
    
    function drag(e) {
      const evt = e.touches ? e.touches[0] : e;
      const dx = evt.clientX - startX;
      const dy = evt.clientY - startY;
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging = true;
        chatContainer.classList.add('is-dragging');
      }
      
      if (isDragging) {
        if (e.cancelable) e.preventDefault();
        const cw = chatContainer.offsetWidth;
        const ch = chatContainer.offsetHeight;
        let newX = Math.min(Math.max(0, initialLeft + dx), window.innerWidth - cw);
        let newY = Math.min(Math.max(0, initialTop + dy), window.innerHeight - ch);
        
        chatContainer.style.left = newX + 'px';
        chatContainer.style.top = newY + 'px';
        chatContainer.style.right = 'auto';
        chatContainer.style.bottom = 'auto';
      }
    }
    
    function stopDrag() {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', stopDrag);
      
      if (isDragging) {
        const cw = chatContainer.offsetWidth;
        const ch = chatContainer.offsetHeight;
        const rect = chatContainer.getBoundingClientRect();
        const margin = 20;
        const isLeft = (rect.left + cw/2) < (window.innerWidth / 2);
        let newY = Math.min(Math.max(margin, rect.top), window.innerHeight - ch - margin);
        
        chatContainer.classList.remove('is-dragging');
        chatContainer.style.top = newY + 'px';
        chatContainer.style.bottom = 'auto';
        chatContainer.style.right = 'auto';
        chatContainer.style.left = (isLeft ? margin : window.innerWidth - cw - margin) + 'px';
        chatContainer.dataset.side = isLeft ? 'left' : 'right';
      } else {
        chatContainer.classList.remove('is-dragging');
      }
      
      // Delay resetting isDragging so click event can check it
      setTimeout(() => { isDragging = false; }, 50);
    }

    chatToggle.addEventListener('mousedown', startDrag);
    chatToggle.addEventListener('touchstart', startDrag, { passive: true });
    
    chatToggle.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      toggleChat();
    });

    // Bouton ✕ dans l'en-tête du panneau : sur mobile le panneau plein écran
    // recouvre entièrement la bulle-bouton (donc sa croix aussi), la rendant
    // injoignable au toucher — impossible de fermer le chat autrement.
    const chatClose = document.getElementById('chat-close');
    if (chatClose) {
      chatClose.addEventListener('click', () => {
        if (isOpen) toggleChat();
      });
    }

    // Auto-open logic based on sessionStorage or URL hash
    if (sessionStorage.getItem('octomask_messages') && window.innerWidth > 860) {
      // Don't auto open on mobile, but do on desktop if there are messages
      setTimeout(() => { if (!isOpen) toggleChat(); }, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();

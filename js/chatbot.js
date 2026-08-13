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
    const chatCloseBtn = document.getElementById('chat-close-btn');

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
            // Check for navigation commands
            const navMatch = replyText.match(/\[NAV:([\w-]+)\]/i);
            if (navMatch) {
              const targetId = navMatch[1];
              replyText = replyText.replace(/\[NAV:[\w-]+\]/i, '').trim();
              const targetSection = document.getElementById(targetId);
              if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
              }
            }

            appendMessage(replyText, 'sys');
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
              appendMessage(intro, 'sys');
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

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', toggleChat);
    }

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

    chatToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat();
    });

    // Context Awareness Logic
    let currentContext = '';
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const sectionId = entry.target.id;
          if (sectionId && sectionId !== currentContext) {
            currentContext = sectionId;
            updateChatContext(sectionId);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    function updateChatContext(sectionId) {
      if (!isOpen) return; // Only push context if chat is open to avoid spam
      
      const contextMessages = {
        'acquisition': { title: 'Acquisition Client', content: 'Je vois que vous regardez nos services d\'acquisition. Voulez-vous voir des études de cas de nos clients ?', action: 'Voir les cas' },
        'studio': { title: 'Purity Studio', content: 'Intéressé par l\'automatisation ? Nous pouvons faire un audit de vos processus actuels.', action: 'Audit gratuit' },
        'tarifs': { title: 'Tarification Flexible', content: 'Nous proposons des forfaits et des projets sur mesure. Quel est votre budget estimé ?', action: 'Voir forfaits' },
      };

      const msg = contextMessages[sectionId];
      if (msg) {
        // Add context widget to chat
        const widgetHtml = `
          <div class="chat-widget">
            <div class="chat-widget__title">💡 Context: ${msg.title}</div>
            <div class="chat-widget__content">${msg.content}</div>
            <a href="#" class="chat-widget__action chat__chip" data-query="${msg.action}">${msg.action}</a>
          </div>
        `;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg msg--sys';
        msgDiv.innerHTML = widgetHtml;
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        
        // Re-bind chip clicks for the new widget
        msgDiv.querySelectorAll('.chat__chip').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const query = btn.getAttribute('data-query');
            if (query && chatInput && chatForm) {
              chatInput.value = query;
              chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          });
        });
      }
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

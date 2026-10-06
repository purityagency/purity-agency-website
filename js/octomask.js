(() => {
  const STORE = 'purity-octomask-v2';
  const BOOKING_URL = 'https://calendar.app.google/yybUurryQkpLmyCQ9';
  let turns = [];
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE));
    if (saved && Date.now() - saved.at < 30 * 60_000 && Array.isArray(saved.turns)) {
      turns = saved.turns.filter(t => ['user', 'assistant'].includes(t.role) && typeof t.text === 'string').slice(-40);
    }
  } catch { /* Private browsing can disable storage. */ }
  const old = document.querySelector('.octo-float');
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'octo-float';
  const LABEL = 'Parler à OctoMask, assistant IA de Purity';
  // Le badge "1" est visible a l'ecran meme s'il est aria-hidden : un aria-label qui ne le
  // reprend pas cree un ecart entre texte visible et nom accessible (utilisateurs de
  // commande vocale notamment). On l'integre au libelle tant que le badge est present.
  launcher.setAttribute('aria-label', LABEL + ' (1 suggestion)');
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'octomask-dialog');
  launcher.innerHTML = '<img src="/assets/octomask-logo.png" width="72" height="72" alt=""><span class="octo-float__notice" aria-hidden="true">1</span>';
  if (old) old.replaceWith(launcher); else document.body.append(launcher);

  const teaser = document.createElement('aside');
  teaser.className = 'octo__teaser';
  teaser.setAttribute('aria-label', 'Invitation à parler avec OctoMask');
  teaser.innerHTML = '<button type="button" class="octo__teaser-close" aria-label="Masquer cette notification">×</button><p><strong>Vous hésitez sur la prochaine étape ?</strong><span>OctoMask vous oriente en 3 questions, sans engagement.</span></p><button type="button" class="octo__teaser-open">Voir la meilleure option</button>';
  document.body.append(teaser);

  // La bulle flottante reste au meme endroit a l'ecran pendant tout le scroll :
  // sur certaines pages elle finit par recouvrir du texte (fin de section,
  // liens du footer). On l'efface simplement quand le pied de page arrive.
  const footer = document.querySelector('.site-footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      document.body.classList.toggle('octo-near-footer', entry.isIntersecting);
    }, { rootMargin: '0px 0px -40% 0px' }).observe(footer);
  }

  const dialog = document.createElement('dialog');
  dialog.id = 'octomask-dialog';
  dialog.className = 'octo';
  dialog.setAttribute('aria-labelledby', 'octo-title');
  dialog.innerHTML = `
    <header class="octo__head">
      <img src="/assets/octomask-logo.png" width="48" height="48" alt="">
      <div class="octo__id"><h2 id="octo-title">OctoMask</h2><p>Votre projet, une prochaine étape claire.</p><span class="octo__progress" data-step="1"><span class="octo__steps" aria-hidden="true"><i></i><i></i><i></i></span><span class="octo__progress-text"><span class="octo__progress-num">Étape 1 sur 3 · </span><span class="octo__progress-label">comprendre votre priorité</span></span></span></div>
      <button type="button" class="octo__icon octo__reset" aria-label="Nouvelle conversation" title="Nouvelle conversation"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg></button>
      <button type="button" class="octo__icon octo__close" aria-label="Fermer la conversation" autofocus>×</button>
    </header>
    <div class="octo__body" tabindex="-1">
      <div class="octo__log" role="log" aria-live="polite" aria-label="Conversation avec OctoMask"></div>
      <div class="octo__typing" aria-hidden="true" hidden><i></i><i></i><i></i></div>
      <div class="octo__suggestions" role="group" aria-label="Réponses suggérées"></div>
    </div>
    <p class="octo__status" role="status"></p>
    <form class="octo__form">
      <label class="octo__sr" for="octo-message">Votre message</label>
      <textarea id="octo-message" rows="1" maxlength="1800" placeholder="Qu’aimeriez-vous améliorer ?" enterkeyhint="send" required></textarea>
      <button type="submit" aria-label="Envoyer le message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg></button>
    </form>
    <div class="octo__foot">
      <details class="octo__privacy"><summary>Assistant IA · confidentialité</summary><p>Vos messages sont traités par Google Gemini pour vous répondre. Le fil est conservé temporairement dans cet onglet et dans la mémoire du serveur (30 minutes d’inactivité). Aucun contact n’est envoyé à Amir sans votre validation sur le formulaire. Évitez les informations sensibles. « Nouvelle conversation » (bouton ↺ en haut) efface le contexte côté site ; cela ne supprime pas les éventuels journaux du fournisseur IA.</p></details>
      <button type="button" class="octo__human">Parler à Amir</button>
    </div>`;
  document.body.append(dialog);
  const body = dialog.querySelector('.octo__body');
  const log = dialog.querySelector('.octo__log');
  const typing = dialog.querySelector('.octo__typing');
  const chips = dialog.querySelector('.octo__suggestions');
  const input = dialog.querySelector('textarea');
  const submit = dialog.querySelector('[type=submit]');
  const status = dialog.querySelector('.octo__status');
  const reset = dialog.querySelector('.octo__reset');
  let busy = false;
  let retryMessage = '';
  let dismissedTeaser = false;
  // Sur telephone, ouvrir le clavier d'office masque la moitie de l'ecran :
  // on laisse lire d'abord, le visiteur touche le champ quand il veut ecrire.
  const touch = window.matchMedia('(hover: none) and (pointer: coarse)');
  const compact = window.matchMedia('(max-width: 600px)');
  const vv = window.visualViewport;

  let pendingReveal = null;
  function toBottom() { body.scrollTop = body.scrollHeight; }
  // Une reponse longue suivie de cartes : on montre son debut, pas la fin des cartes.
  // Fenetre fermee pendant l'attente : on le fera a la reouverture.
  function reveal(node) {
    if (!dialog.open) { pendingReveal = node; return; }
    body.scrollTop += node.getBoundingClientRect().top - body.getBoundingClientRect().top - 12;
  }
  function grow() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 132)}px`;
  }
  // Safari iOS ne reduit pas la page quand le clavier s'ouvre : la fenetre suit
  // donc la zone visible pour garder en-tete, fil et champ a l'ecran.
  function fit() {
    if (!vv || !dialog.open || !compact.matches) {
      dialog.style.removeProperty('--octo-vh');
      dialog.style.removeProperty('--octo-top');
      return;
    }
    const atEnd = body.scrollHeight - body.scrollTop - body.clientHeight < 48;
    dialog.style.setProperty('--octo-vh', `${Math.round(vv.height)}px`);
    dialog.style.setProperty('--octo-top', `${Math.round(vv.offsetTop)}px`);
    if (atEnd) toBottom();
  }

  function save() {
    turns = turns.slice(-40);
    try { sessionStorage.setItem(STORE, JSON.stringify({ at: Date.now(), turns })); } catch {}
  }
  function bubble(text, role) {
    const p = document.createElement('p');
    p.className = `octo__message octo__message--${role}`;
    p.textContent = text;
    log.append(p);
    return p;
  }
  function suggestions(values) {
    chips.replaceChildren();
    values.forEach(value => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = value;
      b.addEventListener('click', () => send(value));
      chips.append(b);
    });
  }
  function welcome() {
    bubble('Je suis OctoMask, l’assistant IA de Purity. En trois questions, on clarifie votre priorité, l’offre adaptée et la prochaine étape. Quel résultat voulez-vous obtenir en premier ?', 'assistant');
    suggestions(['Je veux plus de clients', 'Je veux être trouvé localement', 'Je veux gagner du temps', 'Je veux mieux organiser mon activité']);
  }
  function hideTeaser(permanent = false) {
    teaser.classList.remove('is-visible');
    dismissedTeaser = true;
    if (permanent) try { sessionStorage.setItem(`${STORE}-teaser`, 'hidden'); } catch {}
  }
  function showTeaser() {
    if (turns.length || dismissedTeaser) return;
    try { if (sessionStorage.getItem(`${STORE}-teaser`) === 'hidden') return; } catch {}
    setTimeout(() => {
      if (dialog.open || dismissedTeaser) return;
      teaser.classList.add('is-visible');
      // Une incitation doit rester une aide, pas devenir un obstacle aux
      // boutons du site, particulièrement sur un écran mobile.
      setTimeout(() => { if (!dialog.open) hideTeaser(false); }, 9000);
    }, 7000);
  }
  function markProgress() {
    const step = Math.min(3, Math.max(1, Math.floor(turns.filter(t => t.role === 'user').length) + 1));
    const progress = dialog.querySelector('.octo__progress');
    progress.dataset.step = step;
    progress.querySelector('.octo__progress-num').textContent = `Étape ${step} sur 3 · `;
    progress.querySelector('.octo__progress-label').textContent = step === 1 ? 'comprendre votre priorité' : step === 2 ? 'cadrer la bonne solution' : 'choisir la prochaine étape';
  }
  function offerNudge(offers) {
    if (!offers?.length) return;
    const note = document.createElement('div');
    note.className = 'octo__nudge';
    note.innerHTML = '<strong>Prochaine étape</strong><span>Cette offre vous parle ? On confirme d’abord le périmètre et le résultat attendu, puis vous décidez librement.</span>';
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = 'Préparer ma demande'; b.addEventListener('click', () => handoff(false));
    note.append(b); log.append(note);
  }
  function handoff(booking = false) {
    const text = turns.map(t => `${t.role === 'user' ? 'Vous' : 'OctoMask'} : ${t.text}${t.offers?.length ? '\nOffres évoquées : ' + t.offers.map(o => `${o.name} (${o.price})`).join(' ; ') : ''}`).join('\n\n');
    try {
      const excerpt = text.length > 3400 ? text.slice(0, 1200) + '\n\n[Extrait du fil : échanges intermédiaires omis]\n\n' + text.slice(-2100) : text;
      sessionStorage.setItem('purity-contact-draft', JSON.stringify({ at: Date.now(), message: excerpt }));
    } catch { /* The contact page remains usable without storage. */ }
    location.href = '/contact.html' + (booking ? '#booking-title' : '#contact-form');
  }
  function actionButton(action) {
    if (!['contact', 'booking'].includes(action)) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'octo__action';
    b.textContent = action === 'booking' ? 'Voir les créneaux disponibles' : 'Préparer ma demande avec Amir';
    b.addEventListener('click', () => {
      if (action === 'booking') window.open(BOOKING_URL, '_blank', 'noopener');
      else handoff(false);
    });
    log.append(b);
  }
  function cards(offers) {
    for (const offer of (offers || []).slice(0, 2)) {
      const card = document.createElement('article');
      card.className = 'octo__offer';
      const title = document.createElement('h3'); title.textContent = offer.name;
      const price = document.createElement('strong'); price.textContent = offer.price;
      const desc = document.createElement('p'); desc.textContent = offer.description;
      const note = document.createElement('small'); note.textContent = 'Tarif catalogue indicatif · périmètre et conditions confirmés sur devis.';
      card.append(title, price, desc, note);
      log.append(card);
    }
  }
  async function send(message, retry = false) {
    message = message.trim();
    if (busy || !message || message.length > 1800) return;
    // Sur telephone, le clavier se ferme pour laisser lire la reponse ; le focus
    // reste dans la fenetre au lieu de retomber sur la page derriere.
    // Idem quand la suggestion touchee disparait avec les autres.
    if (touch.matches && (document.activeElement === input || chips.contains(document.activeElement))) body.focus({ preventScroll: true });
    busy = true; submit.disabled = true; reset.disabled = true; input.disabled = true;
    chips.replaceChildren();
    if (!retry) { turns.push({ role: 'user', text: message }); bubble(message, 'user'); save(); }
    if (!retry) { input.value = ''; grow(); }
    status.textContent = 'OctoMask prépare sa réponse…';
    typing.hidden = false; toBottom();
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }), signal: AbortSignal.timeout(27_000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'La réponse est indisponible. Réessayez ou contactez Amir.');
      typing.hidden = true;
      const reply = bubble(data.reply, 'assistant');
      cards(data.offers);
      // Le bouton d'action propose deja de preparer la demande : pas de doublon.
      if (data.action !== 'contact') offerNudge(data.offers);
      actionButton(data.action);
      turns.push({ role: 'assistant', text: data.reply, offers: data.offers, action: data.action }); save();
      suggestions(data.suggestions || []);
      markProgress();
      retryMessage = '';
      status.textContent = '';
      reveal(reply);
    } catch (error) {
      typing.hidden = true;
      retryMessage = message;
      status.textContent = error.name === 'TimeoutError' || error instanceof TypeError
        ? 'La connexion n’a pas abouti. Votre message est conservé ; vous pouvez réessayer ou parler à Amir.' : error.message;
      const retryButton = document.createElement('button');
      retryButton.type = 'button'; retryButton.textContent = 'Réessayer';
      retryButton.addEventListener('click', () => send(retryMessage, true)); chips.append(retryButton);
      toBottom();
    } finally {
      busy = false; submit.disabled = false; reset.disabled = false; input.disabled = false;
      if (dialog.open && !touch.matches) input.focus();
    }
  }
  launcher.addEventListener('click', () => {
    hideTeaser();
    launcher.querySelector('.octo-float__notice')?.remove();
    launcher.setAttribute('aria-label', LABEL);
    dialog.showModal();
    if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
    fit();
    if (pendingReveal) reveal(pendingReveal); else toBottom();
    pendingReveal = null;
    if (!touch.matches) input.focus();
  });
  teaser.querySelector('.octo__teaser-open').addEventListener('click', () => { hideTeaser(true); launcher.click(); });
  teaser.querySelector('.octo__teaser-close').addEventListener('click', () => hideTeaser(true));
  window.addEventListener('scroll', () => hideTeaser(false), { passive: true, once: true });
  dialog.querySelector('.octo__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); }
    dialog.classList.remove('is-typing'); fit(); launcher.focus();
  });
  input.addEventListener('input', grow);
  input.addEventListener('focus', () => { if (touch.matches) dialog.classList.add('is-typing'); });
  input.addEventListener('blur', () => dialog.classList.remove('is-typing'));
  dialog.querySelector('.octo__human').addEventListener('click', () => handoff());
  dialog.querySelector('form').addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(input.value); }
  });
  reset.addEventListener('click', async () => {
    if (busy) return;
    reset.disabled = true;
    try {
      const r = await fetch('/api/chat', { method: 'DELETE' });
      if (!r.ok) throw new Error();
      turns = []; save(); log.replaceChildren(); status.textContent = ''; welcome(); markProgress();
    } catch { status.textContent = 'Impossible d’effacer le contexte serveur pour le moment. Réessayez.'; }
    finally { reset.disabled = false; }
  });
  if (turns.length) turns.forEach(t => { bubble(t.text, t.role); if (t.role === 'assistant') { cards(t.offers); actionButton(t.action); } });
  else welcome();
  markProgress();
  showTeaser();
})();

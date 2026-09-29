# Prompt à coller dans Claude Code

> Ouvre Claude Code dans le dossier `C:\Users\User\Desktop\Purity ONE\purity-v2`, puis colle tout le bloc ci-dessous.

---

Je veux mettre en ligne une page HTML statique sur Cloudflare Pages, avec un sous-domaine personnalisé. Fais-le de bout en bout et vérifie que ça marche.

**Le fichier à publier existe déjà :**
`offres/fm-chauffage/index.html` (dans ce dossier, environ 166 Ko, entièrement autonome — police, images et QR code sont embarqués en base64, aucune dépendance externe).

**Ce que je veux obtenir :**
`https://offre.purity-agency.be/fm-chauffage`

**Contexte :** le domaine `purity-agency.be` est déjà géré chez Cloudflare (il y sert le routage e-mail). Le DNS est donc en place, il n'y a pas de nameserver à changer.

## Étapes

1. **Vérifie les prérequis.** `node --version` et `npm --version`. Installe rien globalement, utilise `npx wrangler@latest`.

2. **Authentifie-toi.** Lance `npx wrangler login`. Ça ouvre mon navigateur pour une autorisation OAuth — dis-moi quand je dois cliquer, et attends que je confirme avant de continuer. Ne me demande jamais de coller un token d'API.

3. **Crée le projet Pages** nommé `purity-offres` (branche de production : `main`).

4. **Déploie le dossier `offres/`** — pas seulement le fichier. La structure en dossier est voulue : elle permet d'ajouter plus tard `offres/autre-client/index.html` sans rien reconfigurer.
   Commande attendue : `npx wrangler@latest pages deploy offres --project-name=purity-offres`

5. **Rattache le domaine personnalisé** `offre.purity-agency.be` au projet. Cloudflare crée l'enregistrement DNS automatiquement puisque la zone est déjà chez eux. Si la commande CLI ne le permet pas dans la version courante de wrangler, dis-le-moi clairement et donne-moi le chemin exact dans le tableau de bord — ne bidouille pas le DNS à la main.

6. **Vérifie.** Une fois en ligne, fais un `curl -I` sur `https://offre.purity-agency.be/fm-chauffage` et confirme un code 200 et un `content-type: text/html`. Vérifie aussi que la page contient bien `noindex` dans ses métadonnées.

## Contraintes

- **Ne modifie pas le contenu de `index.html`.** Chaque chiffre de cette page a été vérifié un par un ; toute retouche de texte ou de mise en forme est à proscrire.
- Ne commit rien sur git et ne pousse rien sans me demander.
- Si une étape échoue, arrête-toi et explique-moi ce qui bloque — ne tente pas trois solutions de contournement.

## À la fin

Donne-moi l'URL finale, et la commande exacte à relancer pour redéployer quand le fichier sera mis à jour.

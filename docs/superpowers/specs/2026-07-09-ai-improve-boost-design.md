# Spécification Technique — Boost de l'Assistant IA d'OctoMask

Ce document détaille les améliorations visuelles et structurelles appliquées à la fonctionnalité d'aide à la rédaction IA (bouton "Améliorer avec l'IA") pour les zones de saisie des besoins clients.

## Approches et Choix de Conception

Nous avons opté pour une approche hybride robuste (Approche A) combinant des effets CSS ultra-premiums, un algorithme d'écriture machine à écrire fluide côté client, et un prompt système Gemini restructuré côté serveur.

### 1. Côté Serveur (Prompt IA Restructuré)
Le prompt système est optimisé pour structurer automatiquement les notes en un brief d'agence haut de gamme :
- **🎯 Objectif** : Une synthèse claire et orientée bénéfice client.
- **🛠️ Besoins clés** : Une liste à puces synthétique des chantiers à réaliser.
- **Génération automatique si vide** : Si l'utilisateur clique sans texte, l'IA génère un brouillon type personnalisé selon le contexte (ex. projet web ou automatisation).

### 2. Côté Client (Effet Machine à Écrire & Halo CSS)
- **Typewriter Effect** : Au lieu d'un remplacement sec, le texte est injecté lettre par lettre à une vitesse très rapide (6ms par caractère) pour un ressenti dynamique haut de gamme. Chaque lettre déclenche un événement `input` pour rafraîchir les labels flottants.
- **Pulsing Glow** : La classe `.is-ai-working` est ajoutée au parent `.field`. Cela déclenche une transition de bordure violette (`#7C3AED`) et une ombre portée externe (`box-shadow`) palpitante.
- **Sécurisation anti-double clic** : Le bouton est désactivé (`pointer-events: none`) pendant le processus.

---

## Modifications proposées

### [MODIFY] [server.js](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/server.js)
Mise à jour de `handleImproveText` :
- Adaptation du prompt système pour renvoyer le format structuré :
  ```
  🎯 Objectif : [Reformulation du but principal en une ou deux sentences percutantes]
  🛠️ Besoins clés :
  - [Besoin 1]
  - [Besoin 2]
  - [Besoin 3]
  ```
- Gestion du cas où le texte envoyé est vide : au lieu de renvoyer une erreur 400, appeler Gemini avec une instruction spéciale pour suggérer des idées de départ.

### [MODIFY] [js/site.js](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/js/site.js)
Mise à jour du gestionnaire de clic du bouton IA :
- Permettre l'envoi d'un champ vide (retrait de la garde `if (!val) return`).
- Ajout de la classe `.is-ai-working` sur le parent `.field`.
- Remplacement du remplacement de valeur brut par une boucle d'écriture progressive rapide.
- Retrait de la classe de chargement une fois l'écriture progressive terminée.

### [MODIFY] [css/site-extra.css](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/css/site-extra.css)
Ajout des styles :
- `.field.is-ai-working` : Bordure violette et lueur palpitante violette.
- `.ai-improve-btn.is-loading` : Styles de transition.

---

## Plan de Validation

### Tests manuels :
1. Cliquer sur le bouton d'amélioration alors que le champ est vide et s'assurer qu'un texte de départ personnalisé est généré.
2. Saisir des notes désordonnées (ex. "veut un site de coiffure avec rdv en ligne et référencé à mons"), cliquer et valider le format structuré avec l'effet d'écriture progressive et le halo violet palpitant.
3. Vérifier que la saisie manuelle n'est pas bloquée après l'amélioration.

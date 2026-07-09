# Spécification Technique — Assistant d'Écriture IA Premium (Purity Agency)

Ce document décrit la refonte de la fonctionnalité d'aide à la rédaction par l'IA ("Sublimer avec l'IA") pour en faire une expérience utilisateur digne des plus grandes agences de design mondiales.

## Principes de Conception

### 1. Copywriting Humain vs. Robot-Slop
- **Adieu les listes d'emojis** : La réponse de l'IA n'utilise plus de structures de type rapport (`🎯 Objectif`, `🛠️ Besoins`).
- **Ton Élite** : Le texte est reformulé à la première personne, de manière fluide, inspirante et percutante. Il utilise un vocabulaire orienté résultats (conversion, UX immersive, performance technique).

### 2. Transition Visuelle Fluide ("Liquid Transition")
- **Adieu l'effet machine à écrire** : Taper le texte lettre par lettre est lent et fastidieux.
- **Flou de Verre & Fondu** :
  - Lors de la génération, le textarea se floute légèrement (`filter: blur(2.5px); opacity: 0.6`) et une lueur violette pulse doucement.
  - À la réception, le texte est mis à jour et retrouve sa netteté et son opacité via une transition CSS soignée de 400ms (`filter: blur(0); opacity: 1`).

### 3. Puces d'Inspiration Interactives (Empty States)
- Si le champ est vide et reçoit le focus, une rangée de 4 puces discrètes apparaît sous la zone de saisie :
  - **Site Vitrine** : *Je souhaite concevoir un site vitrine moderne et immersif pour valoriser mon expertise et capter des prospects qualifiés...*
  - **Boutique E-commerce** : *Je cherche à lancer une boutique e-commerce fluide et performante, optimisée pour maximiser le taux de conversion...*
  - **Portail Client / SaaS** : *Je souhaite développer un portail client sur-mesure pour automatiser nos échanges et centraliser les données...*
  - **Automatisation & CRM** : *Je souhaite interconnecter nos outils internes et automatiser nos processus pour gagner en productivité...*
- Cliquer sur une puce pré-remplit instantanément le champ avec une phrase d'accroche premium, que l'utilisateur peut personnaliser, puis cliquer sur "Sublimer avec l'IA".

---

## Modifications du Code

### [MODIFY] [server.js](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/server.js)
- Optimisation du prompt système de l'API `/api/improve-text` pour imposer un ton d'élite sans émojis ni puces ni titres.

### [MODIFY] [css/site-extra.css](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/css/site-extra.css)
- Styles pour les puces d'inspiration sous le textarea (`.ai-inspiration-chips`, `.ai-chip`).
- Classes pour la transition liquide du textarea (`.textarea-ai-loading`).

### [MODIFY] [js/site.js](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/js/site.js)
- Remplacement du bouton "Améliorer avec l'IA" par "Sublimer avec l'IA".
- Logique d'affichage et masquage des puces d'inspiration lors du focus/saisie.
- Transition fluide (flou de verre + opacité) lors du remplacement du texte.

---

## Plan de Validation

1. **Vérification du Ton** : Tester des phrases simples comme "site pour garage" et s'assurer que le résultat est un paragraphe fluide à la première personne, sans emojis.
2. **Vérification Visuelle** : Observer le flou progressif et le fondu enchaîné lors du clic sur le bouton.
3. **Puces d'inspiration** : Vérifier que les puces apparaissent au focus sur champ vide, se masquent quand on tape, et remplissent correctement le texte au clic.

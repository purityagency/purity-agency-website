# 03 — PRODUITS, SERVICES & MATRICE CRO MODULAIRE

> **Purity Agency** — Document Commercial, Offres & Modélisation du Devis (v1.0)
> *Référence de l'architecture d'offres, du tunnel de checkout et des briques d'upsell.*

---

## 1. OFFRE SOCLE : PACKS MÉTIER CLÉ EN MAIN

Le modèle économique de Purity Agency repose sur un choix initial de **Pack Métier** adapté à l'activité du client, combinant un tarif de création (One-Shot / Acompte) et un abonnement mensuel facultatif ou inclus pour la maintenance et l'hébergement.

| Pack | Nom Commercial | Description & Cible | Acompte / One-Shot | Abonnement Mensuel |
| :--- | :--- | :--- | :--- | :--- |
| `présence` | **Pack Présence Pro** | Vitrine 1-3 pages optimisée pour artisans et indépendants. | **490 €** | 19 €/mois |
| `studio` | **Pack Studio Sur-Mesure** | Site complet 5-10 pages avec animations GSAP & blog. | **990 €** | 29 €/mois |
| `hebergement` | **Hébergement & Sérénité** | Serveur ultra-rapide UE, SSL, sauvegardes & support. | Inclus | 19 €/mois |
| `automatisation` | **Pack IA & Automation** | Intégration d'un agent IA 24/7 et de flux n8n/Make. | **690 €** | 39 €/mois |
| `acquisition` | **Pack Acquisition Local** | Silos SEO Wallonie + Fiche Google Business optimisée. | **590 €** | 49 €/mois |

---

## 2. CATALOGUE DE LA MATRICE DES BRIQUES MODULAIRES (`CUSTOMIZATION_MATRIX.md`)

Les clients peuvent personnaliser leur projet en direct dans le tunnel d'achat `js/pack-checkout.js` et la modale `js/order-modal.js` grâce à des briques d'option activables via des toggles.

### PILIER 1 : CONVERSION & RÉSERVATION (HIGH ROI)

| Code Brique | Nom Commercial | Bénéfice Business Client | Tarif One-Shot | Abonn. Mensuel | SLA Livraison |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BRK-CAL` | **Agenda & RDV 24/7 Pro** | Calendrier automatisé avec rappels SMS anti no-shows. | **290 €** | 19 €/mois | 48h |
| `BRK-CNC` | **Click & Collect / Shop** | Commande directe avec créneau de retrait et paiement. | **490 €** | 29 €/mois | 5 jours |
| `BRK-ROI` | **Simulateur / Devis Dynamique** | Calculateur interactif pour chiffrer les projets prospects. | **390 €** | — | 3 jours |
| `BRK-SOC` | **Preuve Sociale Live** | Ingestion dynamique des avis Google 5★ avec badge. | **190 €** | — | 24h |

### PILIER 2 : AUTOMATISATION IA & OPÉRATIONS

| Code Brique | Nom Commercial | Bénéfice Business Client | Tarif One-Shot | Abonn. Mensuel | SLA Livraison |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BRK-BOT` | **Standard IA 24/7** | Agent conversationnel qualifiant les prospects H24. | **490 €** | 39 €/mois | 3 jours |
| `BRK-REV` | **Gestionnaire Avis IA** | Réponse automatique personnalisée par IA aux avis Google. | **190 €** | 19 €/mois | 24h |
| `BRK-CNT` | **Content Engine IA** | 2 articles de blog mensuels optimisés SEO local Wallonie. | **290 €** | 49 €/mois | Récurrent |

### PILIER 3 : SEO LOCAL & VISIBILITÉ WALLONIE

| Code Brique | Nom Commercial | Bénéfice Business Client | Tarif One-Shot | Abonn. Mensuel | SLA Livraison |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BRK-MAP` | **Domination Google Maps** | Fiche Google Business + 10 annuaires locaux wallons. | **290 €** | — | 4 jours |
| `BRK-SIL` | **Silos SEO Villes** | 5 pages géolocalisées (Charleroi, Namur, Mons, Liège...). | **390 €** | — | 5 jours |

---

## 3. ALGORITHME DE CALCUL DU TUNNEL D'ACHAT

Le script `js/pack-checkout.js` recalcule en temps réel l'acompte et les mensualités selon la formule stricte suivante :

$$\text{Acompte Total} = \text{Acompte Pack Socle} + \sum \left( \text{Tarif One-Shot Brique} \times 30\% \right)$$

$$\text{Mensualité Totale} = \text{Mensualité Pack Socle} + \sum \left( \text{Abonnement Mensuel Brique} \right)$$

### Flux Transactionnel (Ingestion & Webhook)
1. **Sélection Client** : Choix du pack à l'Étape 1 + Choix des briques optionnelles à l'Étape 2.
2. **Collecte du Brief** : Saisie du nom d'entreprise, secteur, ville et objectif.
3. **Création de Commande (`/api/order/create`)** :
   - Génération de la référence unique (`ord_TIMESTAMP_HASH`).
   - Sauvegarde locale du JSON dans `data/orders/`.
   - Création de la session de paiement sécurisée via l'API Mollie.
4. **Validation Webhook (`/api/mollie/webhook`)** :
   - Statut `paid` confirmé par Mollie.
   - Envoi de l'email proforma pro via Resend.
   - Déclenchement automatique du provisionnement client vers Purity OS via `provisionPortalClient()`.

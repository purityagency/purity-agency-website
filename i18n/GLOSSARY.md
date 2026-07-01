# MÉMOIRE COMMUNE — Localisation Purity Agency (10 langues)

> Ce fichier est la **source de vérité partagée** par tous les agents (chercheurs + localisateurs).
> Toute décision de traduction/localisation DOIT respecter ces règles. En cas de doute → suivre ce fichier, pas son intuition.

---

## 1. POSITIONNEMENT FIGÉ (validé avec le client, 2026-07-01)

**Purity Agency = une agence digitale belge, basée à Charleroi (Wallonie), qui parle à chaque communauté linguistique dans SA langue.**

- **Cible = diaspora / communautés linguistiques & expats en Belgique et dans l'UE.**
  Chaque langue vise les locuteurs de cette langue *installés en Belgique / UE* (entrepreneurs, indépendants, PME), PAS le pays d'origine.
  - Exemple : `zh` = entrepreneurs sinophones en Belgique/UE — PAS la Chine.
  - Exemple : `ar` = commerçants arabophones en BE/UE — PAS le Golfe.
  - Exemple : `ru` = diaspora russophone en UE. `hi` = communauté indienne en UE. Etc.
- **Conséquence : mondial par la LANGUE, local par l'ANCRAGE.** La proximité belge est un ARGUMENT, pas un handicap.

## 2. INVARIANTS — NE JAMAIS CHANGER, NI TRADUIRE

Ces éléments restent **identiques dans les 10 langues** :

- **Devise & prix : EUR (€) partout.** Aucune conversion. `390 €`, `1 490 €`, `2 490 €`, `3 800 – 4 800 €`, etc. restent tels quels.
  - Format du montant : garder l'espace fine et le symbole € APRÈS le nombre comme en FR (`1 490 €`), sauf convention forte de la langue — voir §5.
- **Cadre légal : belge.** Mention TVA : *« Petite entreprise soumise au régime de la franchise — TVA non applicable, art. 56bis CTVA »* → à **traduire fidèlement** (sens), mais NE PAS inventer d'équivalent légal local, NE PAS supprimer la référence à l'art. 56bis CTVA.
- **BCE : 1036.775.590** — inchangé.
- **Email : contact@purity-agency.be** — inchangé.
- **Nom de marque : « Purity Agency » / « Purity »** — jamais traduit ni translittéré (garder l'alphabet latin même en zh/hi/ar/ru).
- **« OctoMask »** (nom du chatbot) — jamais traduit.
- **Ancrage géo : « Charleroi », « Wallonie », « Belgique »** — gardés et visibles dans chaque langue (proximité assumée). Peuvent être translittérés/adaptés selon l'usage de la langue (ex: en arabe/chinois, forme locale usuelle du toponyme) mais le lieu reste Charleroi/Belgique.
- **Paiement : « 4× via Stripe/Klarna »** — noms de marque inchangés.
- **Noms des offres/packs** : traduire le sens (ex: « Agenda Plein », « Zéro Appel Perdu ») en gardant l'accroche marketing percutante.

## 3. TON & VOIX (identique dans toutes les langues)

- Vouvoiement / registre respectueux mais chaleureux (l'équivalent du « vous » FR dans chaque langue).
- Concis, direct, moderne. **Zéro jargon, zéro superlatif creux.**
- Orienté bénéfice client (« on vous rend visible », « on vous fait gagner du temps »), pas orienté technique.
- Purity se présente comme un **collectif/une agence** — JAMAIS de nom de fondateur. **Ne jamais citer « Amir ».**
- **Règle de vérité** : n'inventer AUCUN témoignage, chiffre non sourcé, ni promesse. Les chiffres marketing déjà présents (ex: « 62 % des appels non décrochés ») sont conservés tels quels, pas inventés de nouveaux.

## 4. LANGUES (12) & CODES

| Code | Langue | Sens écriture | Note diaspora UE |
|------|--------|---------------|------------------|
| `fr` | Français (SOURCE) | LTR | marché de base BE/FR |
| `en` | English | LTR | expats institutions UE / Bruxelles |
| `nl` | Nederlands | LTR | Flandre — proximité directe |
| `de` | Deutsch | LTR | **Ostbelgien** (germanophones BE) + voisins |
| `es` | Español | LTR | hispanophones UE (Espagnols + Latino-Am) |
| `pt` | Português | LTR | **pt-PT neutre** (PT établis + Brésiliens UE) |
| `zh` | 中文 (simplifié) | LTR | sinophones BE/UE |
| `ru` | Русский | LTR | russophones UE — **neutralité politique** |
| `ar` | العربية | **RTL** | arabophones BE (Charleroi comm. marocaine) |
| `hi` | हिन्दी | LTR | comm. indienne UE — angle proximité+IA, Hinglish |
| `pl` | Polski | LTR | polonais UE (bâtiment/artisanat/services) |
| `it` | Italiano | LTR | diaspora italienne historique BE (HoReCa/commerce) |

## 5. RÈGLES TYPO PAR LANGUE (à compléter par chaque agent dans sa fiche)

- **`ar` (RTL)** : direction droite→gauche. Les nombres et « € », « Purity Agency », emails restent en LTR au sein du texte RTL. `dir="rtl"` sur la page.
- **`zh`** : pas d'espaces entre mots ; ponctuation pleine largeur （，。）. Chiffres arabes conservés.
- **`de`** : mots composés longs — attention aux boutons/titres qui peuvent déborder (garder court).
- **`ru`/`hi`** : le texte s'allonge (~15-30 % vs FR) — préférer des formulations compactes pour titres/CTA.

## 6. CONTRAINTES TECHNIQUES (les localisateurs DOIVENT les respecter)

- Le texte alimente un JSON par langue (`i18n/<code>.json`) avec **les mêmes clés que `fr.json`**. Ne jamais ajouter/supprimer de clé.
- **Préserver les sauts de ligne structurels** : dans le hero et le footer, le FR utilise `<br>` pour découper les lignes animées (clip-mask JS). Garder un `<br>` cohérent dans chaque langue.
- **Préserver les balises inline** autorisées dans les valeurs : `<em>`, `<strong>`, `<br>`, `<small>`, `&nbsp;`. Rien d'autre.
- Longueur des CTA/boutons/tags : rester proche du FR pour ne pas casser la mise en page.

## 7. LIVRABLE PAR AGENT LOCALISATEUR

1. `i18n/<code>.json` — mêmes clés que `fr.json`, valeurs localisées.
2. Une note en tête de sa fiche marché : décisions d'adaptation prises (angle, formulations spécifiques au marché diaspora).
3. Statut dans `PROGRESS.md`.

---
*Ce glossaire est lié au ledger [[PROGRESS]] et aux fiches marché `i18n/research/<code>.md`.*

# Cas concrets — master refonte

Statut : en cours — 4 octobre 2026. Le site public Purity, son hero et ses animations restent hors périmètre.

## Décision produit

Les douze univers sont des preuves de savoir-faire, pas des fiches explicatives. Une carte de galerie donne accès à une vraie page d’accueil de démonstration ; chaque démo garde un bandeau discret Purity, un scénario local et un retour vers son cas concret. Les contenus, prix et disponibilités restent fictifs et clairement localisés aux démos.

## Références étudiées et direction à transposer

| Univers | Référence principale | Ce qui est retenu | Ce qui ne sera pas copié |
| --- | --- | --- | --- |
| Atelier Noma — rénovation | Piet Boon — pietboon.com | rythme de projets, matérialité, grandes images architecturales | mise en page, textes, identité et réalisations |
| Maison Lune — beauté | FaceGym — facegym.com | précision du soin, réservation lisible, énergie éditoriale | promesses, photos, marque ou résultats santé |
| Garage Rive | Singer Vehicle Design — singervehicledesign.com | détail mécanique, narration de savoir-faire, vues de matière | univers Porsche, modèles, contenus et luxe ostentatoire |
| Matière Commune | Ferm Living — fermliving.com | découverte produit, variantes et échelle objet | catalogue, photos, produits et structure e-commerce |
| Beaux Jours | The Modern House — themodernhouse.com | immobilier centré sur le lieu et la qualité d’image | annonces, données ou bien réels |
| Clarté & Associés | Keobiz — keobiz.fr | clarté du parcours, accompagnement par situation | prix, garanties, mentions et logique juridique française |
| Table Serein | Septime — septime-charonne.fr | carte courte, information pratique directe, sobriété gastronomique | recettes, tarifs, horaires et identité |
| Cadence Studio | BodyBase — bodybase.com | choix par pratique, planning comme outil central | offres, coaching et contenu de marque |
| Cabinet Horizon | One Medical — onemedical.com | accueil calme, parcours patient non intrusif | informations médicales, affirmations de soins et cadre américain |
| Patte Douce | Dogdrop — dogdrop.co | confiance, profil animal, étapes d’accueil | prix, modèle d’abonnement et promesses de garde |
| Ligne Claire | Norm Architects — normcph.com | narration visuelle, attention aux volumes, portfolio de projets | images, réalisations et signature éditoriale |
| Thermiq | Aira — airahome.com | pédagogie technique, confort domestique, diagnostic progressif | économies, aides, produits et engagements commerciaux |

MotionSites a été consulté en complément : la direction « 3d Property » suggère un visuel sujet plein écran et des contrôles lisibles, mais son contenu est réservé aux abonnés. Il ne sert que de référence de principe, jamais de source à reproduire.

## Ordre de réalisation

1. Ligne Claire (architecture) — système visuel, portfolio, maquette 3D utile.
2. Matière Commune — produit, variantes, panier local, 3D objet.
3. Beaux Jours — recherche de bien et demande de visite.
4. Garage Rive — prise en charge véhicule et suivi.
5. Atelier Noma — demande de projet structurée.
6. Table Serein — carte et réservation locale.
7. Cadence Studio — planning et inscription.
8. Maison Lune — soins et créneau.
9. Patte Douce — profil animal et rendez-vous.
10. Thermiq — diagnostic de confort.
11. Clarté & Associés — dossier de préparation.
12. Cabinet Horizon — parcours rassurant et minimal.

## Règles de qualité et sortie par univers

- Direction visuelle, layout, typographies, palette, copie et interactions distincts.
- Au moins trois médias originaux utiles par univers ; aucune image réelle ou marque tierce utilisée comme contenu.
- GSAP/ScrollTrigger uniquement lorsque l’animation clarifie une navigation, un espace, un objet ou une séquence ; `prefers-reduced-motion` reste statique.
- Aucun appel réseau depuis les scénarios, aucune réservation, aucun paiement, e-mail ou téléversement réel.
- Vérification : accueil + quatre pages + parcours local à 375, 768, 1280 et 1440 px, clavier, focus, rechargement et écran sans JavaScript.

## Journal

- 2026-10-04 : références définies ; MotionSites / 3d Property observé sans accès au contenu payant. Audit de l’existant : les douze démos partagent encore trop de structure et une image par univers. Premier chantier : Ligne Claire.
- 2026-10-06 : Ligne Claire passe sur trois visuels originaux (jardin, intérieur, maquette) et un mouvement de portfolio mesuré. Vérifié sur desktop et mobile.
- 2026-10-06 : Matière Commune reçoit des médias originaux dédiés à l’objet et à l’intérieur, sans altérer son panier ni sa variante locale.
- 2026-10-06 : Beaux Jours utilise désormais des images originales de biens pour le hero et les cartes ; le scénario de recherche, favoris et demande de visite est conservé. Vérifié au rendu.
- 2026-10-06 : Garage Rive adopte trois médias originaux (véhicule, mécanique, restauration) et conserve son tri par symptôme et sa préparation de rendez-vous. Vérifié au rendu.
- 2026-10-06 : Atelier Noma adopte trois médias originaux (cuisine, plan-matières, salon) tout en gardant sa demande de projet structurée. Vérifié au rendu.
- 2026-10-06 : Table Serein reçoit trois médias originaux (assiette, salle, cuisine) et conserve un parcours de carte et réservation uniquement local. Vérifié au rendu.

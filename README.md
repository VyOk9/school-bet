# 🎓 Edumapper

> **Estime tes chances d’admission dans les écoles supérieures françaises.**

Application web moderne développée avec **Nuxt 4**, **Vue 3**, **TypeScript** et **Tailwind CSS**, permettant aux lycéens de simuler leurs chances d’admission sur la base de leur profil académique.

---

## 🚀 Aperçu rapide

Edumapper guide l’utilisateur à travers **trois étapes simples** :

1. 🏫 **Profil** — Sélection du lycée, de la classe et du type de baccalauréat
2. 📄 **Fiche Avenir** — Upload d’un PDF (facultatif) représentant le dossier scolaire
3. 📊 **Résultats** — Estimation des chances d’admission avec indicateur visuel et fiabilité

---

## 🧰 Stack technique

| Domaine         | Technologie                      |
| --------------- | -------------------------------- |
| Framework       | **Nuxt 4** (Vue 3 + Vite)        |
| Langage         | **TypeScript** (strict mode)     |
| Styling         | **Tailwind CSS v4**              |
| Données locales | **sessionStorage** API           |
| API interne     | Mock API (endpoints Nuxt server) |
| Build & Dev     | Vite + Nuxt DevTools             |

---

## ⚙️ Installation & commandes

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualisation locale du build
npm run preview
```

---

## 🏗️ Structure du projet

```bash
edumapper/
├── assets/
│   └── css/
│       └── main.css               # Styles globaux + configuration Tailwind
├── components/
│   └── LyceePicker.vue            # Sélecteur de lycée (search + navigation clavier)
├── constants/
│   └── data.ts                    # Données statiques (lycées, écoles, spécialités…)
├── pages/
│   ├── index.vue                  # Étape 1 — Profil
│   ├── fiche-avenir.vue           # Étape 2 — Upload PDF
│   └── resultat.vue               # Étape 3 — Résultats
├── server/
│   └── api/
│       ├── fiche-avenir.post.ts   # Endpoint d’upload simulé
│       └── prefill.get.ts         # Pré-remplissage aléatoire / mock API
├── types/
│   └── form.ts                    # Types et interfaces du formulaire
├── utils/
│   ├── random.ts                  # Sélection aléatoire sécurisée
│   └── storage.ts                 # Simplifie l’accès à sessionStorage
├── app.vue                        # Composant racine Nuxt
└── nuxt.config.ts                 # Configuration principale (SSR, Tailwind, TS)
```

---

## ✨ Fonctionnalités principales

### 🏫 Page d’accueil (`/`)

* Recherche dynamique de lycée
* Sélection de la classe et du type de bac (optionnel)
* Sauvegarde automatique dans `sessionStorage`
* Pré-remplissage aléatoire à chaque refresh

### 📄 Fiche Avenir (`/fiche-avenir`)

* Upload par glisser-déposer ou bouton classique (Copier / Coller supporté)
* Vérification du type (`.pdf`)
* Interface fluide et responsive
* Étape facultative (skip possible)

### 📊 Résultats (`/resultat`)

* Calcul aléatoire d’un **pourcentage de chances d’admission**
* Indicateur de **fiabilité visuelle (1 à 5 étoiles)**
* Option “Tester une autre formation” pour recommencer

---

## 💾 Persistance des données

* **sessionStorage** utilisé pour la persistance simple côté client :

  * Données du profil (`lycée`, `classe`, `type de bac`)
  * Résultats simulés (chances + fiabilité)
* Pas de backend réel : tout est géré en local ou via API mock.

---

## 📜 Licence

Projet **privé** — Tous droits réservés.

---

## 💡 Auteur & contexte

Développé dans le cadre du projet **Test Product Engineering**.


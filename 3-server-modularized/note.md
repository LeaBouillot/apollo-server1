# Note : Modularisation du serveur et lodash

La modularisation du serveur est essentielle pour rendre le code plus propre, maintenable et modulaire. Cela implique notamment :

- Découper le code en modules distincts : schémas GraphQL, résolveurs, utilitaires, etc.
- Manipuler efficacement de nombreuses données, objets, tableaux.

**Lodash** est une bibliothèque utile dans ce contexte car elle permet de :

- Gérer facilement les objets et tableaux dans chaque module.
- Faciliter la copie, la fusion, le filtrage ou la transformation des données.
- Rendre le code plus lisible et moins verbeux.

```bash
npm i lodash
````

---

# Type `EquipmentAdv`

* **`EquipmentAdv`** signifie **"Equipment Advanced"**.
* Ce type contient des champs enrichis ou transformés par rapport à `Equipment`.
* Il est utilisé pour exposer des données calculées ou dérivées dans l'API GraphQL.

## Champs notables

| Champ      | Type       | Description                                                          |
| ---------- | ---------- | -------------------------------------------------------------------- |
| `id`       | `ID!`      | Identifiant unique, obligatoire                                      |
| `used_by`  | `String!`  | Utilisateur de l'équipement, obligatoire                             |
| `count`    | `Int!`     | Quantité, obligatoire                                                |
| `use_rate` | `Float`    | Taux d'utilisation (optionnel, calculé si `used_by === "developer"`) |
| `is_new`   | `Boolean!` | Vrai si `new_or_used === "new"` (dérivé, obligatoire)                |

## Remarques

* Le point d’exclamation `!` indique que le champ est **non null**.
* Ce type permet de séparer la **logique métier enrichie** du modèle brut `Equipment`.

## Objectifs détaillés

| But                            | Détail                                                    |
| ------------------------------ | --------------------------------------------------------- |
| Afficher des données enrichies | Calculs dérivés (`is_new`), valeurs ajoutées (`use_rate`) |
| Type fort et obligatoire       | Champs aux types stricts comparé à `Equipment`            |
| Éviter d’altérer la source     | Transformer les données sans modifier les originaux       |
| Meilleure clarté côté client   | Schéma plus explicite pour les consommateurs de l'API     |

## Comparaison des types

| Type           | Signification            | Données exemple                    |
| -------------- | ------------------------ | ---------------------------------- |
| `Equipment`    | Données brutes (base DB) | `new_or_used = "new"`              |
| `EquipmentAdv` | Données enrichies (API)  | `is_new = true`, `use_rate = 0.75` |

---

# `_enums.js`

Ce fichier sert à définir des **types énumérés** (enums) dans ton schéma GraphQL.

## À quoi servent ces enums dans GraphQL ?

* Limiter les valeurs possibles d’un champ à un ensemble prédéfini.
* Garantir la validité des données côté API en forçant l’utilisation de ces valeurs.
* Améliorer la clarté du schéma en documentant explicitement les options disponibles.

```

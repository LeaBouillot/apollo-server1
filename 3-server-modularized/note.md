# Note: Modularisation du serveur et lodash

- Il est important pour rendre le code serveur plus propre, maintenable et modulaire :
  - Découper ton code en modules : schémas GraphQL, résolveurs, utilitaires, etc.
  - Manipuler beaucoup de données, objets, tableaux.

Lodash aide ici à :

- Gérer facilement les objets et tableaux dans chaque module.
- Faciliter la copie, fusion, filtrage ou transformation des données.
- Rendre ton code plus lisible et moins verbeux.

```
npm i lodash
```

# type `EquipmentAdv`

- `EquipmentAdv` = **"Equipment Advanced"**
- Contient des champs enrichis ou transformés par rapport à `Equipment`
- Utilisé pour exposer des données calculées ou dérivées dans l'API GraphQL

## Champs notables

- `id: ID!` — identifiant unique, obligatoire
- `used_by: String!` — utilisateur de l'équipement, obligatoire
- `count: Int!` — quantité, obligatoire
- `use_rate: Float` — taux d'utilisation (optionnel, calculé si `used_by === "developer"`)
- `is_new: Boolean!` — vrai si `new_or_used === "new"` (dérivé, obligatoire)

## Remarques

- Le point d’exclamation `(!)` signifie que le champ est **non null**.
- Ce type permet de séparer la **logique métier enrichie** du modèle brut `Equipment`.

## But | Détail |

| ---------------------------------- | ------------------------------------------------------------ |
| **Afficher des données enrichies** | Calculs dérivés (`is_new`), valeurs ajoutées (`use_rate`) |
| **Type fort et obligatoire** | Les champs ont des types plus stricts que dans `Equipment` |
| **Eviter d’altérer la source** | Permet de transformer les données sans toucher aux originaux |
| **Meilleure clarté côté client** | Un schéma plus explicite pour les consommateurs de l'API |

## Comparaison

| Type           | Signifie                | Données                            |
| -------------- | ----------------------- | ---------------------------------- |
| `Equipment`    | Données brutes (DB)     | `new_or_used = "new"`              |
| `EquipmentAdv` | Données enrichies (API) | `is_new = true`, `use_rate = 0.75` |

# \_enums.js

- définir des types énumérés (enums) dans ton schéma GraphQL.

## À quoi servent ces enums dans GraphQL ?

Limiter les valeurs possibles d’un champ à un ensemble prédéfini.
Garantir la validité des données côté API en forçant l’utilisation de ces valeurs.
Améliorer la clarté du schéma en documentant explicitement les options disponibles.

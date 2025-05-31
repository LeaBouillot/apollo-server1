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


# Union et Interface

### Union

L’union est utilisée lorsqu’on souhaite retourner plusieurs types dans un même tableau.

**Exemple :** retourner à la fois `Equipment` et `Supply`.

- `givens.js`
```
const { gql } = require('apollo-server')
const dbWorks = require('../dbWorks.js')
const typeDefs = gql`
    union Given = Equipment | Supply
`
const resolvers = {
    Query: {
        givens: (parent, args) => {
            return [
                ...dbWorks.getEquipments(args),
                ...dbWorks.getSupplies(args)
            ]
        }
    },
    Given: {
        __resolveType(given, context, info) {
            if (given.used_by) {
                return 'Equipment'
            }
            if (given.team) {
                return 'Supply'
            }
            return null
        }
    }
}
module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}
```

- `_queries.js`
```
const typeDefs = gql`
    type Query {
        // ...
        givens: [Given]
    }
`
```

- `index.js`
```
// ...
const givens = require('./typedefs-resolvers/givens')
// ...
const typeDefs = [
    // ...
    givens.typeDefs
]
// ...
const resolvers = [
    // ...
    givens.resolvers
]
// ...
```
### Query
```
query {
  givens {
    __typename
    ... on Equipment {
      id
      used_by
      count
      new_or_used
    }
    ... on Supply {
      id
      team
    }
  }
}
```

---
### Interface

Une interface définit un type abstrait avec des champs communs pour plusieurs types similaires.  
Elle sert à créer des types qui seront **implémentés** par d’autres types.

**Champs communs :** `id`, `used_by`

- `tools.js`
- `equipments.js`  
- `equipments.js`
- `index.js`

---

### Application à la requête People

- `people.js`
- `_queries.js`
- `index.js`

### Query
```
query {
  people {
    id
    first_name
    last_name
    givens {
        __typename
    	... on Equipment {
      	id
      	used_by
      	count
      	new_or_used
    	}
    	... on Supply {
      	id
      	team
    	}
  	}
    tools {
      __typename
      ... on Equipment {
        id
        used_by
        count
        new_or_used
      }
      ... on Software {
        id
        used_by
        description
        developed_by
      }
    }
  }
}
```
# Arguments et types input

Filtrer et récupérer les données People selon certaines conditions

- `_queries.js`
```
    type Query {
        ...
        peopleFiltered(
            team: Int, 
            sex: Sex, 
            blood_type: BloodType, 
            from: String
        ): [People]
        ...
    }
```

- `people.js`
```
  Query: {
    // ...
    peopleFiltered: (parent, args) => dbWorks.getPeople(args),
  }
```
- Query:
```
query {
  peopleFiltered (
    team: 1
    blood_type: B
    from: "Texas"
  ) {
    id
    first_name
    last_name
    sex
    blood_type
    serve_years
    role
    team
    from
  }
}
```
---

## Pagination des résultats

- `_queries.js`
```
    type Query {
        ...
        peoplePaginated(
            page: Int!,
            per_page: Int!
        ): [People]
        ...
    }
```    
- `people.js`
```
    Query: {
        // ...
        peoplePaginated: (parent, args) => dbWorks.getPeople(args),
        // ...
    }
```
- Query:
```
query {
	peoplePaginated(page: 1, per_page: 7) {
    id
    first_name
    last_name
    sex
    blood_type
    serve_years
    role
    team
    from
  }
}
```    

---

## Utilisation d’alias (badGuys, newYorker...)
```
query {
  badGuys: peopleFiltered(sex: male, blood_type: B) {
    first_name
    last_name
    sex
    blood_type
  }
  newYorkers: peopleFiltered(from: "New York") {
    first_name
    last_name
    from
  }
}
```

---

## Types input

- `people.js`
```
const typeDefs = gql`
    ....
    input PostPersonInput {
        first_name: String!
        last_name: String!
        sex: Sex!
        blood_type: BloodType!
        serve_years: Int!
        role: Role!
        team: ID!
        from: String!
    }
`
const resolvers = {
    // ...
    Mutation: {
        postPerson: (parent, args) => dbWorks.postPerson(args),
    }
}
```
- `_mutation.js`
```
type Mutation {
    postPerson(input: PostPersonInput): People!
    ...
}
```
- Mutation:
```
mutation {
  postPerson(input: {
    first_name: "Hanna"
    last_name: "Kim"
    sex: female
    blood_type: O
    serve_years: 3
    role: developer
    team: 1
    from: "Pusan"
  }) {
    id
    first_name
    last_name
    sex
    blood_type
    role
    team
    from
  }
}
```

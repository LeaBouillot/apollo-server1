# Apollo Server & GraphQL

## Création du projet

1. Ouvre un terminal, puis tape :

```bash
mkdir apollo-server1
cd apollo-server1
code .
```

2. Initialise le projet npm :

```bash
npm init
```

Appuie sur **Entrée** pour accepter les valeurs par défaut et générer le fichier `package.json`.

3. Crée un fichier `index.js` avec ce contenu simple pour tester :

```js
console.log("Projet commence");
```

4. Lance le fichier pour vérifier :

```bash
node index.js
```

Tu devrais voir s’afficher : `Projet commence`

---

## Utilisation de nodemon pour le rechargement automatique

- Si `nodemon` n’est pas installé, installe-le globalement :

```bash
npm install -g nodemon
```

- Lance ton serveur en mode surveillance (rechargement automatique) :

```bash
nodemon index.js
```

- Pour arrêter le serveur, utilise `Cmd + C`.

- Alternativement, ajoute ce script dans le `package.json` pour lancer nodemon via npm :

```json
"scripts": {
  "start": "nodemon index.js"
}
```

- Puis lance avec :

```bash
npm start
```

---

## Ajout d’une base de données mock (fausse base de données)

- Copie le contenu du dossier `2-1-graphql-api-setup` dans ton projet, notamment :

  - Le fichier `database.js`
  - Le dossier `data-in-csv`

- Dans `index.js`, importe la base de données et affiche-la pour test :

```js
const database = require("./database");
console.log(database);
```

- Optionnel : installe l’extension **Edit csv** dans VS Code pour éditer facilement les fichiers CSV.

- Installe la librairie pour convertir CSV en JSON :

```bash
npm i convert-csv-to-json
```

- Relance ton serveur :

```bash
npm start
```

---

## Installation d’Apollo Server et GraphQL

```bash
npm i graphql apollo-server
```

---

## Exemple complet d’un serveur Apollo avec GraphQL

Dans `index.js`, remplace le contenu par :

```js
const database = require("./database");
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    teams: [Team]
  }

  type Team {
    id: Int
    manager: String
    office: String
    extension_number: String
    mascot: String
    cleaning_duty: String
    project: String
  }
`;

const resolvers = {
  Query: {
    teams: () => database.teams,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

---

## Tester les requêtes GraphQL

Dans un client GraphQL (Apollo Studio, Insomnia, Postman ou navigateur), teste la requête suivante :

```graphql
query {
  teams {
    id
    manager
    office
    extension_number
    mascot
    cleaning_duty
    project
  }
}
```

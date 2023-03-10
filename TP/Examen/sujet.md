# Introduction à la Modélisation 

Le modèle semi-structuré n'est pas soumis aux contraintes de normalisation. Ce format est flexible.

De plus un attribut peut avoir plusieurs valeurs, attribut genre ci-dessous :

```js
{
    "title" : "Pulp fiction",
    "genre" : ["Action", "Thriller", "Violent"]
}
```

On peut également représenter des données régulières dans un document :

```js
const artists = [
   artist : { "id" : 1, "name" : "De Niro" },
   artist : { "id" : 2, "name" : "Dujardin" },
   artist : { "id" : 3, "name" : "Chaplin" },
]
```

Les données semi-structurées sont appropriées pour des données complexes et qui ont besoin de souplesse dans leur modélisation.

Avec les données semi-structurées on peut imbriquer les structures pour éviter les jointures du modèle relationel. Mais vous pouvez également utiliser un système de clé primaire/secondaire pour gérer les relations entre collections.

## One-to-Many Relationships

Si on a des authors qui ont une ou plusieurs adresses, alors nous avons une relation entre author et address de type OneToMany. En NoSQL vous avez deux approches pour gérer ce cas :

- Soit vous faites deux documents reliés avec une clé "primaire" et "secondaire". Cette approche sera nécessaire si vous avez **beaucoup** de documents à récupérer.

- Soit vous utilisez l'approche "document imbriqué" : **Embedded Document Pattern**. Ce cas est particulièrement intéressant si vous avez fréquemment besoin d'interroger ces deux entitées.

### Exemple Embedded Document Pattern (OneToMany)

```js
{
   "_id": "joe",
   "name": "Joe Bookreader",
   "addresses": [
        {
            "street": "123 Fake Street",
            "city": "Faketon",
            "state": "MA",
            "zip": "12345"
        },
        {
            "street": "1 Some Other Street",
            "city": "Boston",
            "state": "MA",
            "zip": "12345"
        }
    ]
 }
```

Mais vous pouvez également avoir une approche clé primaire/clé secondaire :

```js
// authors
{
   _id: ObjectId("5ef74d993d4deb402daff427"),
   name: "Joe Bookreader"
}

// addresses
{
   _id : 1,
   author_id: ObjectId("5ef74d993d4deb402daff427"), 
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}

{
  _id : 2,
   author_id: ObjectId("5ef74d993d4deb402daff427"),
   street: "1 Some Other Street",
   city: "Boston",
   state: "MA",
   zip: "12345"
}

```

## Exercice notion de jointure

Créez une nouvelle base de données bookstore.

Créez une collection **categories** et une collection **books** :

- categories

```js
const categories = 
[
    { name : "Programmation"},
    { name : "SQL"},
    { name : "NoSQL"}
];
```

- books

```js
const books = [
   { title : "Python" }, // programmation
   { title : "JS" }, // programmation
   { title : "PosgreSQL" }, // SQL
   { title : "MySQL" }, // SQL
   { title : "MongoDB" } // NoSQL
]
```

1. Faites un script JS afin d'associer chaque livre à sa catégorie en utilisant l'id de sa catégorie. Créez une propriété **category_id** dans la collection books.

2. Puis faites une requête pour récupérer les livres dans la catégorie programmation.

3. Combien de livre y a t il dans la catégorie NoSQL ? 

4. Associez maintenant les livres ci-dessous aux catégories :

```js
const newBooks = [
    { title : "Python & SQL"}, // programmation & SQL
    { title : "JS SQL ou NoSQL" }, // programmation
    { title : "Pandas & SQL & NoSQL"}, // SQL, NoSQL et programmation
    { title : "Modélisation des données"} // aucune catégorie
]
```

5. Récupérez tous les livres qui n'ont pas de catégorie

La création d'un index sur le document permettra une recherche plus rapide sur le champ indexé. Un index est comme un index de livre il permet à MongoDB d'aller plus vite dans la recherche d'une information donnée.

## Exercice tree structure Algorithmique recherche

Dans la base de données **bookstore**.

Créez la collection `categoriestree` contenant les documents suivants :

```js
[
   {
      _id: "Books",
      parent: null,
      name: "Informatique"
   },
   {
      _id: "Programming",
      parent: "Books",
      books: [
            "Python apprendre",
            "Pandas & Python",
            "async/await JS & Python",
            "JS paradigme objet",
            "Anaconda"
      ]
   },
   {
      _id: "Database",
      parent: "Programming",
      books: [
            "NoSQL & devenir expert avec la console",
            "NoSQL drivers",
            "SQL"
      ]
   },
   {
      _id: "MongoDB",
      parent: "Database",
      books: [
            "Introduction à MongoDB",
            "MongoDB aggrégation"
      ]
   }
];
```

Créez un *index* sur la clé `parent` pour accélerer la recherche :

```js
db.categoriestree.createIndex( { parent: 1 } );
```

### Exercice :

Écrire un algorithme qui ajoute une propriété `ancestors` à la collection afin d'énumérer les catégories parentes. Vous utiliserez l'opérateur **addToSet** pour ajouter le/les parent(s) de chaque document.

Par exemple la catégorie MongoDB aurait la propriété `ancestors` suivante :

```js
db.categoriestree.find(
   { _id : "MongoDB" },
   { ancestors : 1 }
);

/*
Doit afficher :
   {
      "_id" : "MongoDB",
      "ancestors" : [
         { "_id" : "Database" },
         { "_id" : "Programming" },
         { "_id" : "Books" }
      ]
   }
*/
```
## Recherche & Développement -  Collection Restaurants
Avec ces nouvelles notions, quelles améliorations pourrions nous apporter à la collection restaurants utilisée précédemment ?

01 - Proposez une série de modifications structurelles de la base de données "ny".
À faire en groupe.

02 - Implémenter ces modifications.

## (facultatif) Application

En utilisant le dossier App, commentez le code du fichier database.js ainsi que le fichier app.js pour expliciter chacune des fonctions utilisées dans cette App.

Puis créez une fonction async/await pour afficher en console le nombre de A et de D de chaque restaurant de Brooklyin.
# TP Shop Update Delete

## Partie 3 inventory

Vous pouvez également trier vos documents à l'aide de la méthode sort, keySort correspond à un système de clé/valeur : { k : 1 }

```js
db.collection.find(restriction, projection).sort(keySort)
```

## Création d'une nouvelle base de données shop

Créez une base de données **shop** et insérez les données suivantes, utilisez la méthode insertMany qui est plus sémantique :

```js
use shop;

db.createCollection("inventory");

db.inventory.insertMany( [{
      "sale" : true, "price" : 0.99,
      "society" : "Alex", type: "postcard", qty: 19,
      size: { h: 11, w: 29, uom: "cm" },
      status: "A",
      tags: ["blank", "blank", "blank"], 
      "year" : 2019  
    },
   { 
       "sale" : false,
       "price" : 1.99,
       "society" : "Alan",
       type: "journal",
       qty: 25,
       size: { h: 14, w: 21, uom: "cm" },
       status: "A",
       tags: ["blank", "red", "blank", "blank"],
       "year" : 2019  
   },
    { 
       "sale" : true,
       "price" : 1.5,
       "society" : "Albert",
       type: "notebook",
       qty: 50,
       size: { h: 8.5, w: 11, uom: "in" },
       status: "A",  
       tags: ["gray"],
       year : 2019
   },
   { 
       "sale" : true, 
       "price" : 7.99, 
       "society" : "Alice", 
       type: "lux paper", 
       qty: 100, 
       size: { h: 8.5, w: 11, uom: "in" }, 
       status: "D", 
       year : 2020 
   },
    { 
       "sale" : true, 
       "price" : 2.99, 
       "society" : "Sophie", 
       type: "planner", 
       qty: 75, 
       size: { h: 22.85, w: 30, uom: "cm" }, 
       status: "D", 
       tags: ["gel", "blue"], 
       year : 2017 
   },
   {
       "sale" : false, 
       "price" : 0.99, 
       "society" : "Phil", 
       type: "postcard", 
       qty: 45, 
       size: { h: 10, w: 15.25, uom: "cm" }, 
       status: "A", 
       tags: ["gray"], 
       year : 2018 
   },
   { 
       "sale" : true, 
       "price" : 4.99, 
       "society" : "Nel", 
       type: "journal", 
       qty: 19, 
       size: { h: 10, w: 21, uom: "cm" }, 
       status: "B", 
       tags: ["blank", "blank", "blank", "red"], 
       "year" : 2019, 
       level : 100  
   },
   { 
       "sale" : true, 
       "price" : 4.99, 
       "society" : "Alex", 
       type: "journal", 
       qty: 15, 
       size: { h: 17, w: 20, uom: "cm" }, 
       status: "C", 
       tags: ["blank"], 
       "year" : 2019  
   },
   { 
       "sale" : false, 
       "price" : 5.99, 
       "society" : "Tony", 
       type: "journal", 
       qty: 100, 
       size: { h: 14, w: 21, uom: "cm" }, 
       status: "B", 
       tags: ["blank","blank", "blank", "red"], 
       "year" : 2020  
   },
]);

```

## 01 Exercices liste inventory

### 01. Affichez tous les articles de type journal. Et donnez la quantité total de ces articles (propriété qty). Pensez à faire un script en JS.

```js
let total = 0;
db.inventory.find({type: "journal"}, {_id: 0, society: 1, qty: 1}).forEach(({society, qty}) => {
    total += qty
});

print(total);
```

En aggregate on peut utiliser le regroupement par rapport à une clé du document.

```js
db.inventory.aggregate([
    { $match: { type: "journal"} },
    { $group:{ _id: "$type", count: { $sum: 1 }, total: { $sum: "$qty"}} }
])
```

### 02. Affichez les noms de sociétés depuis 2018 avec leur quantité (sans agrégation)

```js
db.inventory.find({year: { $gte: 2018}}, {_id: 0, society: 1, qty: 1});

db.inventory.aggregate([
    { $match: { year: { $gte: 2018} } },
    { $project: { _id: 0, society: 1, qty: 1 }}
])
```

### 03. Affichez les types des articles pour les sociétés dont le nom commence par A.

Vous utiliserez une expression régulière classique : /^A/

```js
db.inventory.find({society: /^A/}, {_id: 0, type: 1, society: 1});
```

### 04. Affichez le nom des sociétés dont la quantité d'articles est supérieur à 45.

Utilisez les opérateurs supérieur ou inférieur :

```js
// supérieur >=
// {field: {$gte: value} }

// supérieur
// {field: {$gt: value} }

// inférieur <=
// {field: {$lte: value} }

// inférieur <
// {field: {$lt: value} }
```

```js
db.inventory.find({ qty: {$gt: 45 } }, {_id: 0, type: 1, qty: 1});
```

### 05. Affichez le nom des sociétés dont la quantité d'article(s) est strictement supérieur à 45 et inférieur à 90.

```js
db.inventory.find({ $and: [ 
    { qty: { $gt: 45} }, 
    { qty: { $lt: 90} }  
]}, 
{_id: 0, society: 1, qty: 1}).sort({qty: 1})
```

### 06. Affichez le nom des sociétés dont le statut est A ou le type est journal.

```js
db.inventory.find({ $or: [ 
    { status: "A" }, 
    { type: "journal" }  
]}, 
{_id: 0, society: 1, qty: 1, status: 1})
```

### 07. Affichez le nom des sociétés dont le statut est A ou le type est journal et la quantité inférieur strictement à 100.

```js
db.inventory.find({ 
    $and: [ 
        { $or: [{status: "A"}, {type: "journal"}]},
        { qty: { $lt: 100} }  
]}, 
{_id: 0, type: 1, qty: 1, status: 1})
```

### 08. Affichez le type des articles qui ont un prix de 0.99 ou 1.99 et qui sont true pour la propriété sale ou ont une quantité strictement inférieur à 45.

```js
db.inventory.find({
    $and:[
        {$or: [{price: .99}, {price: 1.99}]},
        {$or: [{sale: true}, {qty:{ $lt: 45 }}]},
    ]
}, 
{_id: 0, type: 1, qty: 1, sale: 1, price: 1}
)
```

### 09. Affichez le nom des sociétés et leur(s) tag(s) si et seulement si ces sociétés ont au moins un tag.

Vous pouvez utiliser l'opérateur d'existance de Mongo pour vérifier que la propriété existe, il permet de sélectionner ou non des documents :

```js
{ field: { $exists: <boolean> } }
```

```js
db.inventory.find({
   tags: { $exists: true }
}, 
{_id: 0, society: 1, tags: 1}
)
```

### 10. Affichez le nom des sociétés qui ont au moins un tag blank.

```js
db.inventory.find({
   tags: "blank"
}, 
{_id: 0, society: 1, tags: 1}
)
```

### 11. Affichez le nom des sociétés qui ont 3 tags blanks uniquement.

```js
// 
function searchTag({ max, tag}){
    let res = [];
    db.inventory.find({
        tags : "blank"
        }, 
        {_id: 0, society: 1, tags: 1}
    ).forEach(({tags, society})=>{
        let count = 0 ;
        for(const t of tags) if( t === tag ) count+=1 ;
        if(count == max) res.push({tags, society});
    });
        
    return res;
}

print(searchTag( { max : 3, tag : 'blank' } ));
```

Approche fonctionnelle dans le find, avec le tag expr


```js

db.inventory.find({tags: "blank", $expr: { $function: {
    body: function(tags, society){
        let [res, count] = [[], 0]; // initialisation des variables
        for(const tag of tags) if( tag === 'blank' ) count+=1 ;
        if(count == 3) {
            res.push({tags, society});

            return res;
        }
        
    },
    args: ["$tags", "$society"],
    lang: "js"
}}}, { tags : 1, _id : 0, society: 1})

```
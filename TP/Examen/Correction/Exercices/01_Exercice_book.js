// 1. Faites un script JS afin d'associer chaque livre à sa catégorie en utilisant l'id de sa catégorie. Créez une propriété categoryId dans la collection books.

const programmation = db.categories.findOne({ name : "Programmation"} );
const sql = db.categories.findOne({ name : "SQL"} );
const noSql = db.categories.findOne({ name : "NoSQL"} );

// 2 Faites une requête pour récupérer les livres dans la catégorie programmation

const booksProgrammation = db.books.findOne({ category_id : programmation._id });

// 3 combine de livre dans la catégorie NoSQL

db.books.find({ category_id : noSql._id }).countDocuments();

// 4 Associez maintenant les livres ci-dessous aux catégories :

const newBooks = [
    { title : "Python & SQL"}, // Programmation & SQL
    { title : "JS SQL ou NoSQL" }, // programmation
    { title : "Pandas & SQL & NoSQL"}, // SQL, NoSQL et Programmation
    { title : "Modélisation des données"}, // aucune catégorie
];

/*
JS moderne
db.books.insertOne({ ...newBooks[0] , category_id: [programmation._id, sql._id] });
*/

// ManyToMany maintenant on a un book qui se trouve dans 0, N catégorie(s) et une category peut contenir de 0, N livre(s)
db.books.insertOne({ title : newBooks[0].title , category_id: [programmation._id, sql._id] });
db.books.insertOne({ title : newBooks[1].title , category_id: [programmation._id, sql._id, noSql._id] });

db.books.insertOne({ title : newBooks[2].title , category_id: [programmation._id, sql._id, noSql._id] });

// Encore une fois sur le modèle semi-structuré on n'est pas obligé de créer le champ category_id pour insérer une données dans la collection books
db.books.insertOne({ title : newBooks[3].title  });

db.books.insertOne({ title : 'Numpy', category_id : null  });


// 05 Récupérez tous les livres qui n'ont pas de catégorie

db.books.find({  $or : [
    
    {category_id  : { $in : [ null, '', 0 ]}},
    {category_id  : {  $exists : false } },
    {category_id  : {  $size : 0 } },

]  }, {title : 1, _id : 0});

// 
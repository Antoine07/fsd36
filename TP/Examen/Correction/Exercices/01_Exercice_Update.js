db.books.remove({});
db.categories.remove({});

const categories = 
[
    { name : "Programmation"},
    { name : "SQL"},
    { name : "NoSQL"}
];

const books = [
    { title : "Python"},  
    { title : "JS" }, 
    { title : "PosgreSQL"}, 
    { title : "MySQL"}, 
    { title : "MongoDB"} 
];

db.createCollection('books');
db.createCollection('categories');

db.books.insertMany(books);
db.categories.insertMany(categories);

const programmation = db.categories.findOne({ name : "Programmation"} );
const sql = db.categories.findOne({ name : "SQL"} );
const noSql = db.categories.findOne({ name : "NoSQL"} );

db.books.updateMany(
    { title : { $in : ['Python', 'JS']}},
    {
        $set : {
            category_id :  programmation._id
        }
    }
);

db.books.updateMany(
    { title : { $in : ['PosgreSQL', 'MySQL']}},
    {
        $set : {
            category_id :  sql._id
        }
    }
);

db.books.updateMany(
    { title : { $in : ['MongoDB']}},
    {
        $set : {
            category_id :  noSql._id
        }
    }
);

// vérifications des mises à jour

db.books.find({}, { _id : 1, category_id : 1 }).pretty();
db.categories.find({}, { _id : 1, category_id : 1 }).pretty();
// Exemple avec $lookup pour récupérer les documents via leur ObjectId :
/*
    db.books.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $project: {
          title: 1,
          category: { $first: "$category" },
        },
      },
    ]);
*/

/*
    On aurait aussi pu le faire en 1 coup avec un pipeline d'aggregation sur l'update :

    db.books.updateMany({}, [
        { $set: {
            category_id: {
                $switch: {
                    branches: [
                        { case: { $in: ['$title', ['Python', 'JS']] }, then: programmation._id },
                        { case: { $in: ['$title', ['PosgreSQL', 'MySQL']] }, then: sql._id },
                        { case: { $eq: ['$title', 'MongoDB'] }, then: noSql._id },
                    ],
                    default: null
                }
            }
        } }
    ]);
*/
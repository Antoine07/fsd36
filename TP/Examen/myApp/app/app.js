import { openDatabase } from "./database.js";

const DB_NAME = "ny";

openDatabase(DB_NAME).then(db => {
  total(db).then(console.log)

});

async function total(db) {

  const restaurants = await db.collection("restaurants");

  const res = await restaurants
    .aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return res;
}



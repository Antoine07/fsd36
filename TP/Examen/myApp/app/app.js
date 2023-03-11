import { openDatabase } from "./database.js";

const DB_NAME = "ny";

openDatabase(DB_NAME).then((db) => {
  total(db).then(console.log);
  statAC(db).then(console.log);
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

async function statAC(db) {
  const restaurants = await db.collection("restaurants");

  const res = await restaurants.aggregate([
      {

        $addFields: {
          gradeA: {
            $function: {
              body: `function (grades) {
                const res = {
                  A: grades.filter((g) => g.grade === "A").length,
                  D: grades.filter((g) => g.grade === "D").length,
                };

                return res;
              }`,
              args: ["$grades"],
              lang: "js",
            },
          },
        },
      },
      { $project: { gradeA: 1, name: 1, _id: 0, restaurant_id: 1 } },
      {
        $group: { _id: "$gradeA", restaurant_id: { $push: "$restaurant_id" } },
      },
      { $sort: { gradeA: -1 } },
      { $limit: 1 },
    ])
    .toArray();

  return res;
}

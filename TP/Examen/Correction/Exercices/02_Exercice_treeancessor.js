const addParents = (_id, doc) => {
  if (doc.parent) {
    print(`parent : ${doc.parent} id : ${_id}`);

    // ajout du parent direct
    db.categoriestree.updateOne(
      { _id: _id },
      { $addToSet: { ancestors: { _id: doc.parent } } }
    );

    // fonction qui s'appelle elle-même attention il faut l'arrêté sinon la recursion ne s'arrête.
    addParents(_id, db.categoriestree.findOne({ _id: doc.parent }));
  }
};

db.categoriestree.find().forEach((doc) => {
  addParents(doc._id, doc);
});

const expenseCategoryModel = require('models/expenseCategory.model');

function create(req, res) {
  expenseCategoryModel.create(req.body, req.params.userId).then(
    expenseCategory => res.status(201).json(expenseCategory),

    msg => res.status(400).json({ msg })
  );
}

module.exports = { create };

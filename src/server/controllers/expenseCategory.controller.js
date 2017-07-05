const expenseCategoryModel = require('models/expenseCategory.model');

function create(req, res) {
  expenseCategoryModel.create(req.body, req.params.userId).then(
    expenseCategory => res.status(201).json(expenseCategory),

    msg => res.status(400).json({ msg })
  );
}

function read(req, res) {
  expenseCategoryModel.read(req.params.userId).then(
    categories => res.status(200).json(categories),

    resp => res.status(resp.status).json({ msg: resp.msg })
  )
}

module.exports = { create, read };

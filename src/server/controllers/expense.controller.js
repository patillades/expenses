const expensesModel = require('models/expenses.model');
const respObj = require('utils/respObj');
const errMsgs = require('utils/errMsgs');

function create(req, res) {
  expensesModel.create(req.body, req.params.userId).then(
    expense => res.status(201).json(expense),

    msg => res.status(400).json({ msg })
  );
}

function read(req, res) {
  const { $gte_date, $lte_date, $gte_amount, $lte_amount, $text } = req.query;

  expensesModel.read(
    req.params.userId,
    { $gte_date, $lte_date, $gte_amount, $lte_amount, $text }
  ).then(
    expenses => res.status(200).json(expenses),

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

function update(req, res) {
  const { expenseId, userId } = req.params;

  expensesModel.update(expenseId, userId, req.body).then(
    (result) => {
      if (!result) {
        return res.status(404).json({ msg: errMsgs.EXPENSE_NOT_FOUND });
      }

      return res.status(204).json({});
    },

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

function remove(req, res) {
  const { expenseId, userId } = req.params;

  expensesModel.remove(expenseId, userId).then(
    (result) => {
      if (!result) {
        return res.status(404).json({ msg: errMsgs.EXPENSE_NOT_FOUND });
      }

      return res.status(200).json({});
    },

    (err) => {
      // the expenseId had a wrong format
      if (err.name === 'CastError') {
        return res.status(404).json({ msg: errMsgs.EXPENSE_NOT_FOUND });
      }

      // @todo log
      const resp = respObj.getInternalErrResp();

      return res.status(resp.status).json({ msg: resp.msg });
    }
  );
}

module.exports = { create, read, update, remove };

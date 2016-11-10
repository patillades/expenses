const expensesModel = require('models/expenses.model');

const respObj = require('utils/respObj');

// curl -i -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODFkYmI2NDcwZTUyZjI5ZmE5ZWM0YmIiLCJpYXQiOjE0Nzg0MzE2MjUsImV4cCI6MTQ3ODUxODAyNX0.mSSjTez3iZwxNTiyxto9Q4ZeNWI7MfEHPAWiVMOvDIg" -d amount=15 -d description='caca' -d date='2016-11-6 12:59' -d comment="com" localhost:3000/api/users/581dbb6470e52f29fa9ec4bb/expenses

function create(req, res) {
  expensesModel.create(req.body, req.params.userId).then(
    expense => res.status(201).json(expense),

    msg => res.status(400).json({ msg })
  );
}

function read(req, res) {
  expensesModel.read(req.params.userId).then(
    expenses => res.status(200).json(expenses),

    // @todo log
    err => {
      const resp = respObj.getInternalErrResp();

      return res.status(resp.status).json({ msg: resp.msg });
    }
  );
}

function remove(req, res) {
  const { expenseId, userId } = req.params;

  expensesModel.remove(expenseId, userId).then(
    result => {
      if (!result) {
        return res.status(404).json({ msg: 'expense not found' });
      }

      return res.status(200).json({});
    },

    err => {
      // the expenseId had a wrong format
      if (err.name === 'CastError') {
        return res.status(404).json({ msg: 'expense not found' });
      }

      // @todo log
      const resp = respObj.getInternalErrResp();

      return res.status(resp.status).json({ msg: resp.msg });
    }
  );
}

module.exports = { create, read, remove };

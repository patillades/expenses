const expensesModel = require('models/expenses.model.js');

// curl -i -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODFkYmI2NDcwZTUyZjI5ZmE5ZWM0YmIiLCJpYXQiOjE0Nzg0MzE2MjUsImV4cCI6MTQ3ODUxODAyNX0.mSSjTez3iZwxNTiyxto9Q4ZeNWI7MfEHPAWiVMOvDIg" -d amount=15 -d description='caca' -d date='2016-11-6 12:59' -d comment="com" localhost:3000/api/users/581dbb6470e52f29fa9ec4bb/expenses

function create(req, res) {
  expensesModel.create(req.body, req.params.userId).then(
    expense => res.status(201).json(expense.toObject()),

    msg => res.status(404).json({ msg })
  );
}

module.exports = { create };

const auth = require('../middleware/auth');
const { Category, validate } = require('../models/category');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await Category.find({});
  res.send(categories);
});

router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('The server understood the request, but is refusing to fulfill it.');
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = await Category.findOne({ name: req.body.name });
  if (category) return res.status(400).send('Category already registered.');

  category = new Category(_.pick(req.body, ['name', 'image', 'weight', 'featured']));

  await category.save();

  res.send(category);
});

module.exports = router;

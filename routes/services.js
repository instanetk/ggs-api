const auth = require('../middleware/auth');
const { Service, validate } = require('../models/service');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const route = req.query.category;
  let category;
  switch (route) {
    case 'coverings':
      category = { category: '5fe14f240acbe8ed7dd727ad' };
      break;
    case 'irrigation':
      category = { category: '5fe14fd00acbe8ed7dd727ae' };
      break;
    case 'painting':
      category = { category: '5fe1881b797ee9f13bb9944d' };
      break;
    case 'cleaning':
      category = { category: '5fe189e35f1c602e5a661d1c' };
      break;
    case 'plumbing':
      category = { category: '5fe18a365f1c602e5a661d1d' };
      break;
    case 'pavers':
      category = { category: '5fe18a5d5f1c602e5a661d1e' };
      break;
    case 'granite':
      category = { category: '5fe18a895f1c602e5a661d1f' };
      break;
    case 'pool':
      category = { category: '5fe18aa85f1c602e5a661d20' };
      break;
    case 'misc':
      category = { category: '5fe23b979c1f9f1f35f8c362' };
      break;
    default:
      category = {};
  }

  const services = await Service.find(category);
  res.send(services);
});

router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('The server understood the request, but is refusing to fulfill it.');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let service = await Service.findOne({ name: req.body.name });
  if (service) return res.status(400).send('Service already exists');

  service = new Service(_.pick(req.body, ['name', 'category', 'i18n', 'image', 'weight', 'featured']));

  await service.save();

  res.send(service);
});

module.exports = router;

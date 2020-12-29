const auth = require('../middleware/auth');
const { Service, validate } = require('../models/service');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const services = await Service.find({});
  res.send(services);
});

router.get('/coverings', async (req, res) => {
  const services = await Service.find({ category: '5fe14f240acbe8ed7dd727ad' });
  res.send(services);
});

router.get('/irrigation', async (req, res) => {
  const services = await Service.find({ category: '5fe14fd00acbe8ed7dd727ae' });
  res.send(services);
});

router.get('/painting', async (req, res) => {
  const services = await Service.find({ category: '5fe1881b797ee9f13bb9944d' });
  res.send(services);
});

router.get('/cleaning', async (req, res) => {
  const services = await Service.find({ category: '5fe189e35f1c602e5a661d1c' });
  res.send(services);
});

router.get('/plumbing', async (req, res) => {
  const services = await Service.find({ category: '5fe18a365f1c602e5a661d1d' });
  res.send(services);
});

router.get('/pavers', async (req, res) => {
  const services = await Service.find({ category: '5fe18a5d5f1c602e5a661d1e' });
  res.send(services);
});

router.get('/granite', async (req, res) => {
  const services = await Service.find({ category: '5fe18a895f1c602e5a661d1f' });
  res.send(services);
});

router.get('/pool', async (req, res) => {
  const services = await Service.find({ category: '5fe18aa85f1c602e5a661d20' });
  res.send(services);
});

router.get('/misc', async (req, res) => {
  const services = await Service.find({ category: '5fe23b979c1f9f1f35f8c362' });
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

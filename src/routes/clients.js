/* eslint-disable max-len */
const express = require('express');

const router = express.Router();
const { Client, Order } = require('../../db/models');

router.get('/', async (req, res) => {
  const allClient = await Client.findAll({ order: [['id', 'DESC']] });
  res.render('clients', { allClient });
});

router.put('/search', async (req, res) => {
  const temp = req.body;
  res.json(temp);
});

router.get('/search', async (req, res) => {
  const { text, select } = req.query;
  const allClient = await Client.findAll({
    where: { [select]: text },
    order: [['id', 'DESC']],
  });
  res.render('clientSearch', { allClient });
});

router.put('/search_order', async (req, res) => {
  const temp = req.body;
  res.json(temp);
});

router.get('/search_order', async (req, res) => {
  const { text, select } = req.query;

  const orderClient = await Order.findAll({
    where: { [select]: text },
    order: [['id', 'DESC']],
  });
  res.render('basketSearch', { orderClient });
});

router.get('/new', (req, res) => {
  res.render('clientCreate');
});

router.post('/new', async (req, res) => {
  const { name, adress, comments } = req.body;
  const commentFromUser = `${comments} от пользователя [${res.locals.userLogin}]!`;
  const user = await Client.create({ name, adress, comments: commentFromUser });
  res.redirect(`/clients/${user.id}`);
});

router.get('/basket/:id', async (req, res) => {
  const { id } = req.params;
  const user = await Client.findByPk(id);

  res.render('basketCreate', { user });
});

router.post('/basket/:id', async (req, res) => {
  const { id } = req.params;
  const {
    orderNumber, type, price, comments, deliveryDate, setupDate, courierTeam, setupTeam, status,
  } = req.body;
  const deliveryCost = price / 10;
  const setupCost = price / 20;
  const commentFromUser = `${comments} - от пользователя [${res.locals.userLogin}]!`;
  await Order.create({
    orderNumber, type, price, deliveryCost, setupCost, comments: commentFromUser, deliveryDate, setupDate, courierTeam, setupTeam, status, clientId: id,
  });
  res.redirect(`/clients/${id}`);
});

router.delete('/basket/:id', async (req, res) => {
  const { id } = req.params;
  await Order.destroy({ where: { id } });
  res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Order.destroy({ where: { clientId: id } });
  await Client.destroy({ where: { id } });
  res.sendStatus(200);
});

router.get('/change/:id', async (req, res) => {
  const { id } = req.params;
  const user = await Client.findByPk(id);
  res.render('change', { user });
});

router.get('/basket/change/:id', async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id);
  const user = await Client.findByPk(order.clientId);
  res.render('basketChange', { user, order });
});

router.put('/basket/change/:id', async (req, res) => {
  const {
    orderNumber, type, price, comments, deliveryDate, setupDate, courierTeam, setupTeam, status,
  } = req.body;
  const { id } = req.params;
  const deliveryCost = price * 0.10;
  const setupCost = price * 0.20;
  const orderCom = await Order.findByPk(id);
  const newComment = `${orderCom.comments} ${comments} - от пользователя [${res.locals.userLogin}]!`;
  await Order.update({
    orderNumber, type, price, deliveryCost, setupCost, comments: newComment, deliveryDate, setupDate, courierTeam, setupTeam, status,
  }, { where: { id } });
  const orderNew = await Order.findByPk(id);
  const user = await Client.findByPk(orderNew.clientId);
  const superId = user.id;
  res.json({ superId });
});

router.put('/:id', async (req, res) => {
  const { name, adress, comments } = req.body;
  const { id } = req.params;
  const userCom = await Client.findByPk(id);
  const newComment = `${userCom.comments} ${comments} от пользователя [${res.locals.userLogin}]!`;
  await Client.update({ name, adress, comments: newComment }, { where: { id } });
  res.sendStatus(200);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await Client.findByPk(id);
  const orderClient = await Order.findAll({
    raw: true,
    where: { clientId: id },
    order: [['orderNumber', 'DESC']],
  });
  res.render('basket', { client, orderClient });
});

module.exports = router;

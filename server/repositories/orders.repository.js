const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const ORDERS_DIR = path.join(env.ROOT, '..', 'data', 'orders');
const LEADS_DIR = path.join(env.ROOT, '..', 'data');

function readOrder(orderId) {
  if (!/^ord_[0-9]+_[a-z0-9]{6}$/.test(orderId)) return null;
  try {
    const filePath = path.join(ORDERS_DIR, orderId + '.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return null;
  }
}

function writeOrder(order) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true });
  fs.writeFileSync(path.join(ORDERS_DIR, order.id + '.json'), JSON.stringify(order, null, 2), 'utf8');
}

function findOrderBySubscription(subscriptionId) {
  if (!subscriptionId) return null;
  try {
    fs.mkdirSync(ORDERS_DIR, { recursive: true });
    const files = fs.readdirSync(ORDERS_DIR).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const order = JSON.parse(fs.readFileSync(path.join(ORDERS_DIR, f), 'utf8'));
        if (order.mollieSubscriptionId === subscriptionId) return order;
      } catch (err) { /* ignore */ }
    }
  } catch (err) { /* ignore */ }
  return null;
}

function findOrderByMolliePayment(paymentId) {
  if (!paymentId) return null;
  try {
    fs.mkdirSync(ORDERS_DIR, { recursive: true });
    const files = fs.readdirSync(ORDERS_DIR).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const order = JSON.parse(fs.readFileSync(path.join(ORDERS_DIR, f), 'utf8'));
        if (order.molliePaymentId === paymentId) return order;
      } catch (err) { /* ignore */ }
    }
  } catch (err) { /* ignore */ }
  return null;
}

function logLead(lead) {
  const line = JSON.stringify({ at: new Date().toISOString(), ...lead }) + '\n';
  try {
    fs.mkdirSync(LEADS_DIR, { recursive: true });
    fs.appendFileSync(path.join(LEADS_DIR, 'leads.log'), line);
  } catch (err) { /* ignore */ }
}

module.exports = {
  readOrder,
  writeOrder,
  findOrderBySubscription,
  findOrderByMolliePayment,
  logLead,
  ORDERS_DIR
};

// Simple repository interface for potential local booking data/logs
const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const BOOKINGS_LOG = path.join(env.ROOT, '..', 'data', 'bookings.log');

function logLocalBooking(booking) {
  const line = JSON.stringify({ at: new Date().toISOString(), ...booking }) + '\n';
  try {
    fs.mkdirSync(path.dirname(BOOKINGS_LOG), { recursive: true });
    fs.appendFileSync(BOOKINGS_LOG, line);
  } catch (err) { /* ignore */ }
}

module.exports = {
  logLocalBooking
};

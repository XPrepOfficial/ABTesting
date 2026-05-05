require('dotenv').config();

const express = require('express');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use(routes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

async function start() {
  await connectDB();
  app.listen(PORT, () => console.info(`[App] AB Testing Service listening on port ${PORT}`));
}

start().catch((err) => {
  console.error('[App] Startup failed:', err.message);
  process.exit(1);
});

module.exports = app;

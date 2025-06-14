import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';

const routes: Record<string, any> = {};

fs.readdirSync(__dirname).forEach((file) => {
  const part = file.split('.');
  if (part[0] === 'index') return;

  const modulePath = path.join(__dirname, file);
  if (fs.statSync(modulePath).isFile() && part[1] === 'ts') {
    routes[part[0]] = require(modulePath).default || require(modulePath);
  }
});

for (var name in routes) {
  console.log(name)
  router.use(`/${name}`, routes[name])
}

export default router;


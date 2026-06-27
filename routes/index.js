const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'MCCommands | Minecraft Command API' });
});

module.exports = router;

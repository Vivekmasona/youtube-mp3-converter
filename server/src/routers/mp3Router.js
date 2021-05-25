const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send({ ok: "ok" });
});

// route to send youtube link and download it on local server
router.get('/convert', async (req, res) => {
    res.send({ ok: "ok" });
});

module.exports = router;
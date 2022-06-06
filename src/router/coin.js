const { Router } = require('express')

const router = new Router()

const Coin = require('../models/coin')

router.get('/', async (req, res) => {
	try {
		const details = await Coin.find({}).populate('ticker', 'name');
		return res.send(details);
	} catch (error) {
		return res.send(error.message);
	}
})

router.post('/', async (req, res) => {
	try {
		const coin = await Coin.create({ ...req.body })
		return res.send(coin);
	} catch (error) {
		return res.send(error.message);
	}
})


router.get('/:coin', async (req, res) => {
	try {
		const { coin } = await Coin.find({ ticker: req.params.coin });
		return res.send(coin);
	} catch (error) {
		return res.send(error.message);
	}
})


module.exports = router;
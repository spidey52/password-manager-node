const { Router } = require('express')
const Ticker = require('../models/ticker')

const router = new Router()

router.get('/', async (req, res) => {
	try {
		const tickers = await Ticker.find()
		return res.send(tickers)
	} catch (error) {
		return res.send(500).send(error.message)
	}
})

router.get('/sharma', async (req, res) => {
	const sharmaProfit = require("../binance/sharma")
	const profit = await sharmaProfit()
	return res.send({ profit: profit * 80 })
})

router.post("/", async (req, res) => {
	try {
		const ticker = req.body.ticker
		const isExists = await Ticker.findOne({ name: ticker })
		if (isExists) {
			console.log(isExists)
			return res.send("already have coin added")
		}
		const createdTicker = await Ticker.create({ name: ticker })
		return res.send(createdTicker)
	} catch (error) {
		return res.send(error.message)
	}
})

router.delete("/:ticker", async (req, res) => {
	const ticker = req.params.ticker
	const lol = await Ticker.findOneAndDelete({ name: ticker })

	return res.send("deleted")
})

module.exports = router
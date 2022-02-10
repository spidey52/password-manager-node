const { Router } = require('express')
const Ticker = require('../models/ticker')

const router = new Router()

const { getAllProfits, isValidTicker } = require("../binance/satyam")
const { default: axios } = require('axios')

router.get('/', async (req, res) => {
	try {
		const tickers = await Ticker.find({})
		return res.send(tickers)
	} catch (error) {
		return res.status(500).send(error.message)
	}
})

router.get('/sharma', async (req, res) => {
	const sharmaProfit = require("../binance/sharma")
	const profit = await sharmaProfit()
	console.log(profit)
	return res.send({ profit: profit * 80 })
})

router.get('/satyam', async (req, res) => {
	let tickers = req.query.tickers?.split(',') || []
	const profit = await getAllProfits(tickers)
	return res.send({ profit })
})


router.get('/margin', async (req, res) => {
	const { getPositions } = require('../binance/satyam')
	const data = await getPositions()
	return res.send(data)
})

router.post("/", async (req, res) => {
	try {
		const ticker = req.body.ticker
		if (!ticker) return res.status(400).send('please send {ticker: tickername}')
		const isExists = await Ticker.findOne({ name: ticker })
		if (isExists) {
			return res.status(500).send("ticker already added")
		}
		const isValid = await isValidTicker(ticker)
		if (!isValid) return res.status(500).send('invalid ticker name')
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

router.delete("/id/:id", async (req, res) => {
	const id = req.params.id
	const ticker = await Ticker.findByIdAndDelete(id)

	return res.send('deleted');
})

module.exports = router
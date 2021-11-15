const ccxt = require("ccxt")
const Ticker = require("../models/ticker")

// sharma key
const API_KEY = process.env.SHARMA_API
const SECRET = process.env.SHARMA_SECRET

const config = {
	apiKey: API_KEY,
	secret: SECRET,
	enableRateLimit: true,
	options: {
		defaultType: "future",
	},
}

const exchange = new ccxt.binance(config)

const getProfit = async (ticker, option) => {
	let totalProfit = 0
	const date = new Date()
	const orders = await exchange.fetchMyTrades(ticker)
	orders.forEach(order => {
		if (order.info.realizedPnl) {
			totalProfit += parseFloat(order.info.realizedPnl)
			if (parseFloat(order.info.realizedPnl) !== 0) {
				if (option && option.log) {
					const date = new Date(order.timestamp)
					console.log(date.toLocaleString(), " --- profit/loss  --- ", order.info.realizedPnl)
					// console.log(order.info.realizedPnl)
				}
			}
		}
	})

	console.log(`total profit of  ${ticker} : ${totalProfit}`)
	return totalProfit
}

const getAllProfits = async () => {

	const tickers = await Ticker.find({})
	let totalProfit = 0

	for (let i = 0; i < tickers.length; i++) {
		totalProfit += await getProfit(tickers[i].name, { log: false })
	}
	// console.log('overall total profit: ', totalProfit * 80)
	return totalProfit
}


module.exports = getAllProfits
const ccxt = require("ccxt")
const Ticker = require("../models/ticker")

// sharma key
const API_KEY = process.env.SHARMA_API
const SECRET = process.env.SHARMA_SECRET

const config = {
	apiKey: API_KEY,
	secret: SECRET,
	enableRateLimit: true,
	options: {
		defaultType: "future",
	},
}

const exchange = new ccxt.binance(config)

const getProfit = async (ticker, option) => {
	let totalProfit = 0
	const date = new Date()
	const orders = await exchange.fetchMyTrades(ticker)
	orders.forEach(order => {
		if (order.info.realizedPnl) {
			totalProfit += parseFloat(order.info.realizedPnl)
			if (parseFloat(order.info.realizedPnl) !== 0) {
				if (option && option.log) {
					const date = new Date(order.timestamp)
					console.log(date.toLocaleString(), " --- profit/loss  --- ", order.info.realizedPnl)
					// console.log(order.info.realizedPnl)
				}
			}
		}
	})

	console.log(`total profit of  ${ticker} : ${totalProfit}`)
	return totalProfit
}

const getAllProfits = async () => {

	const tickers = await Ticker.find({})
	let totalProfit = 0

	for (let i = 0; i < tickers.length; i++) {
		totalProfit += await getProfit(tickers[i].name, { log: false })
	}
	// console.log('overall total profit: ', totalProfit * 80)
	return totalProfit
}


module.exports = getAllProfits

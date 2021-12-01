const ccxt = require("ccxt")
const Ticker = require("../models/ticker")
require('dotenv').config()

// sharma key
const API_KEY = process.env.SATYAM_API
const SECRET = process.env.SATYAM_SECRET

const config = {
	apiKey: API_KEY,
	secret: SECRET,
	enableRateLimit: true,
	options: {
		defaultType: "future",
	},
	milliseconds: () => Date.now() - 1000
}

const exchange = new ccxt.binance(config)



const getTodayProfit = async (ticker, option) => {
	let totalProfit = 0
	const orders = await exchange.fetchMyTrades(ticker)

	orders.forEach(order => {
		const orderDate = new Date(order.timestamp)
		const todayDate = new Date()
		const isToday = orderDate.toDateString() === todayDate.toDateString()
		if (order.info.realizedPnl && isToday) {
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

	totalProfit = totalProfit.toFixed(2)

	console.log(`total profit of  ${ticker} : ${totalProfit}`)
	return totalProfit
}

getTodayProfit("ALPHAUSDT")



const ccxt = require("ccxt")
const Ticker = require("../models/ticker")

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
				}
			}
		}
	})

	totalProfit = totalProfit

	console.log(`total profit of  ${ticker} : ${totalProfit}`)
	return totalProfit
}

const getAllProfits = async (tickers) => {

	const val = await exchange.fetchMarkets()
	const tickersName = val.map(t => t.id)

	let totalProfit = 0

	for (let i = 0; i < tickers.length; i++) {
		if (!tickersName.includes(tickers[i])) continue;
		totalProfit += await getTodayProfit(tickers[i], { log: false })
	}
	return totalProfit

}



const getPositions = async () => {
	const data = await exchange.fetchBalance()
	const { totalWalletBalance } = data.info

	const filledData = []
	const positions = {}
	let totalInitialMargin = 0
	let totalUnrealizedProfit = 0
	let positionsSum = 0


	data.info.positions.forEach((ticker) => {
		const { entryPrice, initialMargin, symbol, positionAmt, unrealizedProfit } = ticker
		if (parseFloat(initialMargin) > 0) {
			totalInitialMargin += parseFloat(initialMargin)
			totalUnrealizedProfit += parseFloat(unrealizedProfit)
			filledData.push(ticker)
			positions[symbol] = (parseFloat(entryPrice) * parseFloat(positionAmt))
		}
	})

	Object.keys(positions).forEach(key => positionsSum += positions[key])

	// total position, how much margin i taken
	console.log('total positon size: ', positionsSum)
	console.log('total wallet balance: ', parseFloat(totalWalletBalance))
	console.log('total initial margin: ', totalInitialMargin)

	const leftBalance = totalWalletBalance - totalInitialMargin
	const marginToTrade = leftBalance - Math.abs(totalUnrealizedProfit);
	const amountWhenBalanceZero = totalInitialMargin - Math.abs(marginToTrade)
	console.log("extra margin left: ", leftBalance)
	console.log("total unrealized profit: ", totalUnrealizedProfit)
	console.log("required amount to add: ", marginToTrade)
	console.log("amount when position get liquidated: ", amountWhenBalanceZero)

	return { leftBalance, totalUnrealizedProfit, marginToTrade, amountWhenBalanceZero }
}

const isValidTicker = async (ticker) => {

	const val = await exchange.fetchMarkets()
	const tickersName = val.map(t => t.id)

	console.log(tickersName)

	return tickersName.includes(ticker)

}


module.exports = { getAllProfits, getPositions, getTodayProfit, isValidTicker }

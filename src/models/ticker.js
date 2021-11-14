const { model, Schema } = require('mongoose')

const TickerSchema = new Schema({
	name: {
		type: String
	}
})

const Ticker = model("Ticker", TickerSchema)

module.exports = Ticker
const mongoose = require('mongoose')

const CoinSchema = new mongoose.Schema({
	ticker: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Ticker'
	},

	side: {
		// false = buy, true = sell
		type: Boolean,
		default: true
	},

	price: {
		type: Number,
	},

	wallet: {
		// option1 = spot, option2 = future
		type: String,
	}

},
	{
		timestamps: true
	}
)

const Coin = mongoose.model("Coin", CoinSchema)

module.exports = Coin
const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log("DB CONNECTION SUCCESS"))
		.catch((err) => {
			console.log(`DB CONNECTION ISSUES`);
			console.error(err.message);
			process.exit(1);
		});
};

module.exports = dbConnect;

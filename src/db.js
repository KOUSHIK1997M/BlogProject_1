const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(process.env.DB || "mongodb+srv://project_1:Llgfqe5Is4BXArKU@cluster0.u6u38bx.mongodb.net/project_1?retryWrites=true&w=majority", connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
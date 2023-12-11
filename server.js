const express = require("express");
const path = require("path");
const logger = require("morgan");
const multer = require("multer");
const upload = multer({ dest: "uploads/" })
const router = express.Router();
const app = express();
const PORT = 5001;


// Application-level middleware
const loggerMiddleware = (req, res, next) => {
	console.log(`${new Date()} --- Request [${req.method}] [${res.statusCode}] [${req.url}]`);
	next();
}

app.use(loggerMiddleware);

// Third party middleware
app.use(logger("combined"));

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

// Router-level middleware
app.use("/api/users", router);
app.use("/profile", router);

const fakeAuth = (req, res, next) => {
	const authStatus = true;
	if(authStatus) {
		console.log("User authStatus:", authStatus);
		next();
	} else {
		res.status(401);
		throw new Error("Users is not authorized");
	}
}

const getUsers = (req, res) => {
	res.json({ message: "Get all users" });
};

const createUser = (req, res) => {
	console.log(req.body, "Request body");
	res.json({ message: "Create new user" });
}

router.use(fakeAuth);
router.route("/").get(getUsers).post(createUser);
router.post('/profile', upload.single('avatar'), (req, res) => {
	console.log(req.body, req.file);
});


// Error-handling middleware
const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;
	res.status(statusCode);

	switch(statusCode) {
		case 401: 
			res.json({
				title: "Unauthorized",
				message: err.message
			});
			break;
		case 404: 
			res.json({
				title: "Not Found",
				message: err.message
			});
			break;
		case 500: 
			res.json({
				title: "Server Error",
				message: err.message
			});
			break;
		default:
			break;
	}
}

app.all("*", (req, res) => {
	res.status(404);
	throw new Error("Route not found");
})

app.use(errorHandler);
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
})
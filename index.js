const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads" })
const app = express();
const PORT = process.env.PORT || 5001;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = [
	{
		id: 0,
		name: "User 1",
		password: "password"
	},
	{
		id: 1,
		name: "User 2",
		password: "password2"
	},
	{
		id:2,
		name: "User 3",
		password: "password3"
	},
];

app.post("/profile", upload.single("avatar"), (req, res, next) => {
	res.send({ file: req.file, name: req.body.name });
}, (err, req, res, next) => {
	res.status(400).send({ err: err.message });
})

app.get("/", (req, res) => {
	res.json({ title: "Welcome to NODEJS Beginner App" });
})

app.get("/users", (req, res) => {
	res.json(users);
});

app.get("/users/:id", (req, res) => {
	const { id } = req.params;
	console.log(users)
	const user = users.find(user => user.id === Number(id));

	if(user) {
		res.json(user);
	} else {
		res.json({ title: "Not Found", message: "User does not exist" })
	}
});

app.post("/users", (req, res) => {
	const { name, password } = req.body;
	let id = users[users.length - 1].id + 1;
	const newUser = {
		id,
		name: req.body.name,
		password: req.body.password
	};

	users.push(newUser);
	res.json({ message: "New user added" });
});

app.put("/users/:id", (req, res) => {
	const { id } = req.params;
	const updatedUser = users.map(user => 
		user.id === Number(id) ? 
			{...user, name: req.body.name, password: req.body.password} 
		: 
			user
	);
	users = [];
	users.push(...updatedUser);

	res.send({ title: "User updated", message: "Updated user data" })
});

app.delete("/users/:id", (req, res) => {
	const { id } = req.params;
	const updatedUsers = users.filter(user => user.id !== Number(id));
	users = [];
	users.push(...updatedUsers);
		res.send({ tiitle: "User deleted", message: `User ${id} has been deleted` });
})



app.listen(PORT, () => {
	console.log(`Server started at port: ${PORT}`);
});
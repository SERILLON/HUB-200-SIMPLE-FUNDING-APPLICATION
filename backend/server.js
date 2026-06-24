const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = [];
let fundings = [];

app.post('/register', (req, res) => {
	const { name, password } = req.body;
	if (!name || !password) {
		return res.json({ error: 'Error' });
	}
	const user = {
		id: users.length + 1,
		name,
		password
	};
	users.push(user);
	res.json({ message: 'user created', user });
});

app.post('/login', (req, res) => {
	const { name, password } = req.body;
	const user = users.find(
		u => u.name === name && u.password === password
	);  
	if (!user) {
		return res.json({ error: 'Error' });
	}
	res.json({ message: 'connected', user });
});

app.get('/fundings', (req, res) => {
	res.json(fundings);
});

app.post('/fundings', (req, res) => {
	const data = {
		id: fundings.length + 1,
		title: req.body.title,
		description: req.body.description,
		price: req.body.price
	};
	fundings.push(data);
	res.json(data);
});

app.listen(3000, () => {
	console.log('server ok');
});

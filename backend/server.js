const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let fundings = [];

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

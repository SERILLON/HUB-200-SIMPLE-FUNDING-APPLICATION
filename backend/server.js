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
		return res.json({error: "error"});
	}
	const existingUser = users.find(
		u => u.name === name
	);
	if (existingUser) {
		return res.json({error: "error"});
	}
	const user = {
		id: users.length + 1,
		name,
		password
	};
	users.push(user);
	res.json({message: "Account created", user});
});

app.post('/login', (req, res) => {
	const { name, password } = req.body;
	const user = users.find(
		u =>
		u.name === name &&
		u.password === password
	);
	if (!user) {
		return res.json({error: "Wrong login"});
	}
	res.json({message: "Connected", user});
});

app.get('/fundings', (req,res)=>{
	res.json(fundings);
});

app.post('/fundings',(req,res)=>{
	const {
		title,
		description,
		price,
		userId
	} = req.body;
	if (!userId) {
		return res.json({error:"Not connected"});
	}
	const funding = {
    id: fundings.length + 1,
		title,
		description,
		price,
		userId
	};
	fundings.push(funding);
	res.json({message:"Funding created", funding});
});

app.get('/fundings/:userId',(req,res)=>{
	const userFundings = fundings.filter(
		f => f.userId == req.params.userId
	);
	res.json(userFundings);
});

app.listen(3000,()=>{
	console.log("server ok");
});

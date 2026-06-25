const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

let db = {
	users: [],
	fundings: []
};
if (fs.existsSync("database.json")) {
	db = JSON.parse(fs.readFileSync("database.json"));
}
function saveDB() {
	fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
}

app.post('/register', (req, res) => {
	const { name, password } = req.body;
	if (!name || !password) {
		return res.json({error: "Please fill all fields"});
	}
	const existingUser = db.users.find(
		u => u.name === name
	);
	if (existingUser) {
		return res.json({error: "User already exists"});
	}
	const user = {
		id: db.users.length + 1,
		name,
		password
	};
	db.users.push(user);
  saveDB();
	res.json({message: "Account created", user});
});

app.post('/login', (req, res) => {
	const { name, password } = req.body;
	const user = db.users.find(
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
	res.json(db.fundings);
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
    id: db.fundings.length + 1,
		title,
		description,
		price,
		userId
	};
	db.fundings.push(funding);
  saveDB();
	res.json({message:"Funding created", funding});
});

app.get('/fundings/:userId',(req,res)=>{
	const userFundings = db.fundings.filter(
		f => f.userId == req.params.userId
	);
	res.json(userFundings);
});

app.delete('/fundings/:id',(req,res)=>{
	const id = Number(req.params.id);
	const initialLength = db.fundings.length;
	db.fundings = db.fundings.filter(f => f.id !== id);

	if (db.fundings.length === initialLength) {
		return res.json({error:"Funding not found"});
	}

	saveDB();
	res.json({message:"Funding deleted"});
});

app.listen(3000,()=>{
	console.log("server ok");
});

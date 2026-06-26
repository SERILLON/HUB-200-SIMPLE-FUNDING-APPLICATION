import {useEffect,useState} from "react";
import {BrowserRouter,Routes,Route,useNavigate} from "react-router-dom";

const API = "/api";

function Login(){
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();

  async function login(){
    if(!name.trim() || !password.trim()){
      alert("Please fill all fields");
      return;
    }

    try{
      const res=await fetch(`${API}/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,password})
      });
      const data=await res.json();
      if(data.error){
        alert(data.error);
        return;
      }
      if(data.user){
        localStorage.setItem("user",JSON.stringify(data.user));
        navigate("/fundings");
        return;
      }
      alert("Login failed");
    }catch(error){
      console.error(error);
      alert("Impossible to reach the server");
    }
  }

  async function register(){
    const res=await fetch(`${API}/register`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,password})
    });
    const data=await res.json();
    if(data.error){
      alert(data.error);
      return;
    }
    alert("Compte créé");
  }

  return(
    <div>
      <h1>Login</h1>
      <input placeholder="name" onChange={e=>setName(e.target.value)}/>
      <input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
    </div>
  );
}

function Fundings(){
  const [fundings,setFundings]=useState([]);
  const [form,setForm]=useState({title:"",description:"",price:""});
  const user=JSON.parse(localStorage.getItem("user") || "{}");

  async function loadFundings(){
    const res=await fetch(`${API}/fundings`);
    const data=await res.json();
    setFundings(data);
  }

  async function addFunding(event){
    event.preventDefault();

    if(!user.id){
      alert("Please login first");
      return;
    }

    if(!form.title.trim() || !form.description.trim() || !form.price){
      alert("Please fill title, description and amount");
      return;
    }

    try{
      const res=await fetch(`${API}/fundings`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          title:form.title,
          description:form.description,
          price:Number(form.price),
          userId:user.id
        })
      });

      const data=await res.json();

      if(data.error){
        alert(data.error);
        return;
      }

      setForm({title:"",description:"",price:""});
      loadFundings();
      alert("Demand created");
    }catch(error){
      console.error(error);
      alert("Impossible to reach the server");
    }
  }

  async function deleteFunding(id){
    try{
      const res=await fetch(`${API}/fundings/${id}`,{
        method:"DELETE"
      });
      const data=await res.json();

      if(data.error){
        alert(data.error);
        return;
      }

      loadFundings();
    }catch(error){
      console.error(error);
      alert("Impossible to reach the server");
    }
  }

  useEffect(()=>{
    loadFundings();
  },[]);

  return(
    <div>
      <h1>Funding request</h1>

      <form onSubmit={addFunding}>
        <div>
          <label>Titre</label>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        </div>

        <div>
          <label>Description</label>
          <textarea
            rows={1}
            style={{resize:"none"}}
            value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}
          />
        </div>

        <div>
          <label>Montant</label>
          <input type="number" min="1" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
        </div>

        <button type="submit">Créer la demande</button>
      </form>

      <h2>Liste des demandes</h2>
      <ul>
        {fundings.map(f=>(
          <li key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
            <div>
              <strong>{f.title}</strong> - {f.price}€
              <div>{f.description}</div>
            </div>
            <button onClick={()=>deleteFunding(f.id)} aria-label={`Supprimer ${f.title}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/fundings" element={<Fundings/>}/>
      </Routes>
    </BrowserRouter>
  );
}

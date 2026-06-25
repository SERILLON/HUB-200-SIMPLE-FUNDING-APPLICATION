import {useEffect,useState} from "react";
import {BrowserRouter,Routes,Route,useNavigate} from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "/api";

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

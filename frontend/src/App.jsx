import { useState } from "react";

const API = "http://localhost:3000";

export default function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  async function login() {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      setError("");
    } else {
      setError("Login incorrect");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Connecté</h1>
      <p>Bienvenue {user.name}</p>
       <button onClick={() => setUser(null)}>
        Logout
      </button>
    </div>
  );
}

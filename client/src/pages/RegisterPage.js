import {useState} from "react";
import {  toast } from 'react-toastify';
import { Navigate } from "react-router-dom";


export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect]=useState(false)
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      credentials:"include",
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
    });
    if (response.status === 200) {
      toast.success(`Registration Success`, {
        position: toast.POSITION.CENTER,
      });
      setRedirect(true)
    } else {
      toast.success(`Registration failed`, {
        position: toast.POSITION.CENTER,
      });
    }
  }
  if(redirect){
    return <Navigate to={"/"}/>
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Register</button>
    </form>
  );
}
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const {login}=useContext(AuthContext)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate=useNavigate()
  const handleSubmit = async (e)=>{
    try{
      e.preventDefault()
      await login(email,password)
      navigate('/')
    }catch(err){
      console.error("Login fallido", err)
    }
    
  }

  return (
    <form action="" onSubmit={handleSubmit}>
        <input type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
    </form>
  )
}

export default Login
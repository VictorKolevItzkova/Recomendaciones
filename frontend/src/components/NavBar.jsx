import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import SearchBar from './SearchBar'
const NavBar = () => {
    const {usuario,logout}=useContext(AuthContext)
    const [searchTerm,setSearchTerm]=useState('')
    const navigate=useNavigate()
    const handleClick= async (e)=>{
        try{
            e.preventDefault()
            await logout()
            navigate('/')
        }catch(err){
            console.log("Log Out Fallido", err)
        }

    }

    return (
        <nav className="bg-cyan-700 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mi App</h1>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} navigate={navigate}/>
                <div className="hidden md:block">
                    <Link
                    to="/"
                    className="mx-4 hover:text-slate-300 transition py-2"
                    >
                        Home
                    </Link>
                    {usuario && (
                    <>
                        <button className='mx-4 hover:text-slate-300 transition border px-4 py-2 rounded-md' onClick={handleClick}>
                            Log Out
                        </button>
                    </>
                        
                    )}
                    {!usuario && <Link
                        to="/login"
                        className="mx-4 hover:text-slate-300 transition border px-4 py-2 rounded-md"
                    >
                        Log in
                    </Link>}
                </div>
            </div>
        </nav>
    )
}

export default NavBar
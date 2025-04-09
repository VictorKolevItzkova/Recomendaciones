import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const NavBar = () => {
    const {usuario,logout}=useContext(AuthContext)
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
                <div>
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
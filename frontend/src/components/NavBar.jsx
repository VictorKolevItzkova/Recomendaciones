import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import SearchBar from './SearchBar'
const NavBar = () => {
    const baseImgUrl = import.meta.env.VITE_BASE_IMG_URL
    const { usuario } = useContext(AuthContext)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    return (
        <nav className="bg-cyan-700 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">MatchIT</Link>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} navigate={navigate} />
                <div className="flex justify-center items-center">
                    {usuario && (
                        <>
                            <Link
                                to="/"
                                className="hidden md:block mx-4 hover:text-slate-300 transition py-2 px-4 border rounded-md"
                            >
                                Diario
                            </Link>
                            <Link to="/settings">
                                <img className='hidden md:block mx-4 bg-white rounded-full w-12 h-12' src={`${baseImgUrl}${usuario.pfp}`} alt="" />
                            </Link>
                        </>

                    )}
                    {!usuario && (
                        <>
                            <Link
                                to="/register"
                                className='hidden md:block mx-4 hover:text-slate-300 transition py-2'
                            >
                                Registrarse
                            </Link>
                            <Link
                                to="/login"
                                className="hidden md:block mx-4 hover:text-slate-300 transition border px-4 py-2 rounded-md"
                            >
                                Log in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar
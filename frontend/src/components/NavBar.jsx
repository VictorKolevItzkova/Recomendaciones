import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav className="bg-cyan-700 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mi App</h1>
                <div>
                    <Link
                        to="/"
                        className="mx-4 text-white hover:text-gray-200 transition"
                    >
                        Home
                    </Link>
                    <Link
                        to="/login"
                        className="mx-4 text-white hover:text-gray-200 transition"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
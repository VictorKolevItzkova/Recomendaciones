import React from 'react'

const SideBar = ({ setSeccion }) => {
    const handleClick = (seccion) => {
        setSeccion(seccion)
    }
    return (
        <div className="w-1/4 p-4 bg-slate-600">
            <h3 className="text-lg font-semibold mb-4">Filtrar por</h3>
            <ul className="space-y-2">
                <li>
                    <button onClick={() => handleClick('all')} className="w-full text-left p-2 border rounded">
                        Todo
                    </button>
                </li>
                <li>
                    <button onClick={() => handleClick('pelicula')} className="w-full text-left p-2 border rounded">
                        Películas
                    </button>
                </li>
                <li>
                    <button onClick={() => handleClick('usuario')} className="w-full text-left p-2 border rounded">
                        Usuarios
                    </button>
                </li>
                <li>
                    <button onClick={() => handleClick('credito')} className="w-full text-left p-2 border rounded">
                        Créditos
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default SideBar
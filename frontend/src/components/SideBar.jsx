import React from 'react'

const SideBar = ({ setSeccion, seccionActual }) => {
    const handleClick = (seccion) => {
        setSeccion(seccion)
    }

    const botonClase = (nombre) =>
        `w-full text-left p-2 rounded cursor-pointer ${
            seccionActual === nombre ? 'bg-cyan-900 text-white' : ''
        }`
    return (
        <div className="w-1/4 p-4">
            <h3 className="text-lg font-semibold mb-4">Filtrar por</h3>
            <ul className="space-y-2 border rounded p-2">
                <li>
                    <button onClick={() => handleClick('all')} className={botonClase('all')}>
                        Todo
                    </button>
                </li>
                <hr />
                <li>
                    <button onClick={() => handleClick('pelicula')} className={botonClase('pelicula')}>
                        Películas
                    </button>
                </li>
                <hr />
                <li>
                    <button onClick={() => handleClick('usuario')} className={botonClase('usuario')}>
                        Usuarios
                    </button>
                </li>
                <hr />
                <li>
                    <button onClick={() => handleClick('credito')} className={botonClase('credito')}>
                        Créditos
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default SideBar
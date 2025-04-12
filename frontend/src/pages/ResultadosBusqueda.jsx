import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import SideBar from '../components/SideBar'

const ResultadosBusqueda = () => {
    const { api } = useContext(AuthContext)
    const location = useLocation()
    const query = new URLSearchParams(location.search).get('q') || ''
    const [seccion, setSeccion] = useState('all')
    const [resultados, setResultados] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/search/${seccion}/${query}`)
                setResultados(response.data)
            } catch (err) {
                setResultados([])
            }
        }

        if (query) {
            fetchData()
        } else {
            setResultados([])
        }
    }, [query, seccion])
    console.log(resultados)
    return (
        <div className="flex">
            <SideBar setSeccion={setSeccion} />  {/* Pasar el setter de sección */}
            <div className="w-3/4 p-6">
                <h2 className="text-xl mb-4">Resultados para: <strong>{query}</strong></h2>
                <ul className="space-y-4">
                    {resultados.map((item) => {
                        switch (item.tipo) {
                            case 'usuario':
                                return <li key={`u-${item.id}`} className="p-2 border rounded">👤 Usuario: {item.nombre}</li>
                            case 'pelicula':
                                return <li key={`p-${item.id}`} className="p-2 border rounded">🎬 Película: {item.title}</li>
                            case 'creditos':
                                return <li key={`c-${item.id}`} className="p-2 border rounded">🎭 Actor: {item.nombre}</li>
                            default:
                                return null
                        }
                    })}
                </ul>
            </div>
        </div>
    )
}

export default ResultadosBusqueda
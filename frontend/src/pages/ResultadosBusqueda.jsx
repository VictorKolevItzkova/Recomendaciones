import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ResultadosBusqueda = ({ seccion = 'all' }) => {
    const { api } = useContext(AuthContext)
    const location = useLocation()
    const query = new URLSearchParams(location.search).get('q') || ''
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
    }, [query])
    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Resultados para: <strong>{query}</strong></h2>
            <ul className="space-y-4">
                {resultados.map((item) => {
                    switch (item.tipo) {
                        case 'usuario':
                            return <li key={`u-${item.id}`} className="p-2 border rounded">👤 Usuario: {item.nombre}</li>
                        case 'pelicula':
                            return <li key={`p-${item.id}`} className="p-2 border rounded">🎬 Película: {item.title}</li>
                        case 'cast':
                            return <li key={`c-${item.id}`} className="p-2 border rounded">🎭 Actor: {item.nombre}</li>
                        default:
                            return null
                    }
                })}
            </ul>
        </div>
    )
}

export default ResultadosBusqueda
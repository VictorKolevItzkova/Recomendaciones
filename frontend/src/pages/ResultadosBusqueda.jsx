import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import SideBar from '../components/SideBar'
import PeliculaResultado from '../components/PeliculaResultado'
import UsuarioResultado from '../components/UsuarioResultado'
import CreditoResultado from '../components/CreditoResultado'
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

    const agruparPorTipo = (resultados) => {
        const grupos = {
            pelicula: [],
            usuario: [],
            creditos: [],
        }
    
        resultados.forEach(item => {
            if (grupos[item.tipo]) {
                grupos[item.tipo].push(item)
            }
        })
    
        return grupos
    }

    const intercalarResultados = (grupos) => {
        const intercalado = []
        let hayResultados = true
        let indexMap = {
            pelicula: 0,
            usuario: 0,
            creditos: 0,
        }
    
        while (hayResultados) {
            hayResultados = false
    
            for (const tipo of ['pelicula', 'usuario', 'creditos']) {
                const cantidad = Math.floor(Math.random() * 3) + 1 // entre 1 y 3
                const start = indexMap[tipo]
                const items = grupos[tipo].slice(start, start + cantidad)
    
                if (items.length > 0) {
                    intercalado.push(...items)
                    hayResultados = true
                    indexMap[tipo] += items.length
                }
            }
        }
    
        return intercalado
    }

    return (
        <div className="flex px-20">
            <SideBar setSeccion={setSeccion} />
            <div className="w-3/4 p-6">
                <h2 className="text-xl mb-4">Resultados para: <strong>{query}</strong></h2>
                <ul className="space-y-4">
                    {intercalarResultados(agruparPorTipo(resultados)).map((item) => {
                        switch (item.tipo) {
                            case 'usuario':
                                return <UsuarioResultado key={item.id} item={item}/>
                            case 'pelicula':
                                return <PeliculaResultado key={item.id} item={item}/>
                            case 'creditos':
                                return <CreditoResultado key={item.id} item={item}/>
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
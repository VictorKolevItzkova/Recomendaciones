import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import {useDebounce} from 'react-use'

const SearchBar = ({ searchTerm, setSearchTerm, navigate }) => {
  const [debounceSearch,setDebounceSearch]=useState('')
  const [isFirstRender, setIsFirstRender] = useState(true)

  // Evita que se hagan demsiadas llamadas a la API esperando a 
  // que el usuario deje de escribir después de 500 ms
  useDebounce(()=>{
    if (isFirstRender) {
      // Si es el primer render, no hacemos nada.
      setIsFirstRender(false)
      return
    }
    if(debounceSearch===''){
      navigate("/");
    }else {
      navigate(`/buscar?q=${encodeURIComponent(debounceSearch)}`);
    }
  },500,[debounceSearch])

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setDebounceSearch(value)
  }

  return (
    <div className="hidden md:block relative w-1/2">
      <input
        className="w-full p-3 pl-10 bg-cyan-900 rounded-md focus:outline-none"
        type="text"
        placeholder="Busca a través de miles de Peliculas"
        value={searchTerm}
        onChange={handleChange}
      />
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white" />
    </div>

  )
}

export default SearchBar
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
const Settings = () => {
    const { usuario, api, logout, updateUser } = useContext(AuthContext)

    const [nombre, setNombre] = useState('')
    const [passwordActual, setPasswordActual] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [pfp, setPfp] = useState('')
    const [preview, setPreview] = useState('')

    useEffect(() => {
        if (usuario) {
            setNombre(usuario.nombre)
            if (usuario.pfp) {
                setPreview(`http://localhost:5100/uploads/images/${usuario.pfp}`)
            }
        }
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setPfp(file)
        setPreview(URL.createObjectURL(file))
    }

    const verificarPassword = async () => {
        try {
            const res = await api.post('/usuarios/checkPassword', { password: passwordActual })

            if (res.data.estado) {
                setIsPasswordValid(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('nombre', nombre)
        formData.append('pfp', pfp)
        if(newPassword){
            formData.append('newPassword', newPassword)
            setIsPasswordValid(!isPasswordValid)
            setPasswordActual('')
            setNewPassword('')
        }

        try {
            updateUser(formData)
        } catch (err) {
            console.log(err)
            if(err.response){
                console.log('Respuesta servidor:', err)
            }else{
                console.log('Error general:', err)
            }
        }
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Ajustes de usuario</h2>

            <form onSubmit={handleSubmit}>
                <label className="block mb-2">Nombre:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border rounded w-full px-2 py-1 mb-4"
                />

                <label className="block mb-2">Nueva contraseña (opcional):</label>
                {!isPasswordValid ? (
                    <>
                        <label className="block mb-2">Verifica tu contraseña:</label>
                        <input
                            type="password"
                            value={passwordActual}
                            onChange={(e) => setPasswordActual(e.target.value)}
                            className="border rounded w-full px-2 py-1 mb-2"
                        />
                        <button
                            type="button"
                            onClick={verificarPassword}
                            className="bg-blue-600 text-white px-4 py-1 rounded mb-4"
                        >
                            Verificar
                        </button>
                    </>

                ) : (<input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border rounded w-full px-2 py-1 mb-4"
                />)
                }

                <label className="block mb-2">Foto de perfil:</label>
                <input
                    className="mb-2 bg-amber-50 text-black"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-full mb-4" />}

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Guardar
                </button>
            </form>
            <button type="button"
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded mt-4">
                
                Cerrar sesión
            </button>
        </div>
    )
}

export default Settings
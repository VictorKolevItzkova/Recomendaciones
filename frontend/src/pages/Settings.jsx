import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Helmet } from 'react-helmet'

import EsqueletoSettings from '../esqueletos/EsqueletoSettings'

const Settings = () => {
    const { usuario, api, logout, updateUser } = useContext(AuthContext)

    const [nombre, setNombre] = useState('')
    const [passwordActual, setPasswordActual] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [pfp, setPfp] = useState('')
    const [preview, setPreview] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const delayMinimo = 500;
        const inicio = Date.now();

        const cargarUsuario = async () => {
            if (usuario) {
                setNombre(usuario.nombre || '');
                if (usuario.pfp) {
                    setPreview(`http://localhost:5100/uploads/images/${usuario.pfp}`);
                }
            }

            const tiempoTranscurrido = Date.now() - inicio;
            const tiempoRestante = delayMinimo - tiempoTranscurrido;

            setTimeout(() => setIsLoading(false), Math.max(0, tiempoRestante));
        };

        setIsLoading(true);
        cargarUsuario();
    }, [usuario]);

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
                setShowModal(false)
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
        if (newPassword) {
            formData.append('newPassword', newPassword)
            setIsPasswordValid(false)
            setPasswordActual('')
            setNewPassword('')
        }

        try {
            updateUser(formData)
            setNombre(formData.get('nombre'))
            setShowModal(false)
        } catch (err) {
            console.log('Error al actualizar usuario:', err)
        }
    }

    if (isLoading) {
        return <EsqueletoSettings />
    }

    return (
        <>
            <Helmet>
                <title>Ajustes</title>
            </Helmet>
            <div className="flex flex-col md:flex-row p-6 max-w-4xl mx-auto gap-8">
                {/* Sección izquierda */}
                <div className="md:w-1/3 space-y-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 w-full text-white px-4 py-2 rounded"
                    >
                        Guardar cambios
                    </button>

                    <button
                        onClick={logout}
                        className="bg-red-600 w-full text-white px-4 py-2 rounded"
                    >
                        Cerrar sesión
                    </button>
                </div>

                {/* Sección derecha */}
                <div className="md:w-2/3">
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2 font-semibold">Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="border rounded w-full px-2 py-1 mb-4"
                        />

                        <label className="block mb-2 font-semibold">Foto de perfil:</label>
                        <div className="mb-4">
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <label
                                htmlFor="fileInput"
                                className="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Seleccionar imagen
                            </label>
                        </div>
                        {preview && <img src={preview} alt="preview" className="w-34 h-34 object-cover rounded-full my-4" />}

                        {isPasswordValid && (
                            <>
                                <label className="block mb-2">Nueva contraseña:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="border rounded w-full px-2 py-1 mb-4"
                                />
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Cambiar contraseña
                        </button>
                    </form>
                </div>

                {/* Modal cambiar contraseña */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setIsPasswordValid(false)
                                    setPasswordActual('')
                                    setNewPassword('')
                                }}
                                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                            >
                                &times;
                            </button>
                            <h3 className="text-black text-lg font-semibold mb-4">Cambiar contraseña</h3>

                            {!isPasswordValid &&
                                <>
                                    <label className="text-black block mb-2">Verifica tu contraseña actual:</label>
                                    <input
                                        type="password"
                                        value={passwordActual}
                                        onChange={(e) => setPasswordActual(e.target.value)}
                                        className="text-black border rounded w-full px-2 py-1 mb-4"
                                    />
                                    <button
                                        onClick={verificarPassword}
                                        className="bg-blue-600 text-white px-4 py-1 rounded"
                                    >
                                        Verificar
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Settings
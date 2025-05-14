import { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Helmet } from 'react-helmet'

import EsqueletoSettings from '../esqueletos/EsqueletoSettings'
import { TriangleAlert } from 'lucide-react'

const Settings = () => {
    const { usuario, api, logout, updateUser,deleteUser } = useContext(AuthContext)

    const [nombre, setNombre] = useState('')
    const [passwordActual, setPasswordActual] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [pfp, setPfp] = useState('')
    const [preview, setPreview] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)
    const [errorVerificar, setErrorVerificar] = useState(null)
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const dialogRef = useRef(null);
    
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
                setErrorVerificar(null)
            } else {
                setErrorVerificar("Contraseña no válida")
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
            setError(null)
            await updateUser(formData)
            setNombre(formData.get('nombre'))
            setShowModal(false)
        } catch (err) {
            setError(err)
        }
    }

    const eliminarCuenta = async (e) => {
        try {
            e.preventDefault()
            await deleteUser()
            cerrarModal()
        }catch (err) {
            console.log(err)
        }
    }

    const abrirModal = async () => {
        if (!dialogRef.current) return;

        dialogRef.current?.classList.remove("animate-fadeOut");
        dialogRef.current?.classList.add("animate-popIn");
        dialogRef.current?.showModal();
        setModalAbierto(true);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        if (!dialogRef.current) return;
        dialogRef.current.classList.add("animate-fadeOut");
        setTimeout(() => {
            dialogRef.current?.close();
            dialogRef.current?.classList.remove("animate-popIn");
            dialogRef.current?.classList.remove("animate-fadeOut");
            setModalAbierto(false);
            setModalVisible(false);
        }, 150);

    };

    useEffect(() => {
        const dialog = dialogRef.current;
    
        const handleScrollLock = () => {
            if (modalAbierto) {
                document.body.classList.add("overflow-hidden");
            } else {
                document.body.classList.remove("overflow-hidden");
            }
        };
    
        const handleClickOutside = (e) => {
            if (dialog && modalAbierto) {
                const rect = dialog.getBoundingClientRect();
                const clickInside =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;

                if (!clickInside) {
                    cerrarModal();
                }
            }
        }
    
        handleScrollLock();
        window.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.body.classList.remove("overflow-hidden");
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalAbierto]);

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
                        className="bg-green-600 w-full text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Guardar cambios
                    </button>

                    <button
                        onClick={logout}
                        className="bg-red-800 w-full text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Cerrar sesión
                    </button>
                    <button
                        onClick={abrirModal}
                        className="bg-red-600 w-full text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Eliminar Cuenta
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
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        {!isPasswordValid && (
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(true)
                                    setError(null)
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Cambiar contraseña
                            </button>
                        )}
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
                                    {errorVerificar && <p className="text-red-500 text-sm text-left mb-1">{errorVerificar}</p>}
                                    <button
                                        onClick={verificarPassword}
                                        className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                                    >
                                        Verificar
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                )}
                <dialog
                    ref={dialogRef}
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 w-full max-w-md border shadow-lg backdrop:bg-black/50 transition-all duration-200 ease-out
                                        ${modalVisible ? "animate-popIn" : ""}`}
                >
                    <h2 className="text-lg font-bold mb-4 flex"><TriangleAlert className="text-red-600"/> Eliminar Cuenta  <TriangleAlert className="text-red-600"/></h2>
                    <p className="text-sm text-gray-700 mb-4">
                        ¿Estás seguro de que deseas eliminar tu cuenta? Perderás toda tu información. Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={cerrarModal}
                            className="bg-cyan-700 text-white px-8 py-1 rounded cursor-pointer"
                        >
                            NO
                        </button>
                        <button
                            onClick={eliminarCuenta}
                            className="bg-[#2d333b] border border-slate-400 text-[#e95148] px-9 py-1 rounded cursor-pointer hover:bg-[#b62324] hover:text-white transition duration-300"
                        >
                            SI
                        </button>
                    </div>
                </dialog>
            </div>
        </>
    )
}

export default Settings
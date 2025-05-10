import { useRef, useState, useEffect } from 'react'
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'

const Footer = () => {
    const aboutRef = useRef(null)
    const privacyRef = useRef(null)

    const [modalVisible, setModalVisible] = useState({
        about: false,
        privacy: false,
    })

    const openModal = (type) => {
        const ref = type === 'about' ? aboutRef : privacyRef
        if (ref.current) {
            ref.current.showModal()
            setModalVisible(prev => ({ ...prev, [type]: true }))
            document.body.style.overflow = 'hidden'
        }
    }

    const closeModal = (type) => {
        const ref = type === 'about' ? aboutRef : privacyRef
        if (ref.current) {
            ref.current.close()
            setModalVisible(prev => ({ ...prev, [type]: false }))
            document.body.style.overflow = 'auto'
        }
    }

    const handleClickOutside = (e, type) => {
        const ref = type === 'about' ? aboutRef : privacyRef
        if (ref.current && e.target === ref.current) {
            closeModal(type)
        }
    }

    const currentYear = new Date().getFullYear()

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal('about')
                closeModal('privacy')
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [])

    return (
        <>
            <footer className='bg-[#222222] py-7'>
                <div className='flex flex-col md:flex-row justify-between items-center mx-5 px-4'>
                    <div className='text-sm text-white'>
                        <span>© {currentYear} MatchIT, Inc.</span>
                        <button
                            className='hover:text-slate-300 mx-2'
                            onClick={() => openModal('about')}
                        >
                            About
                        </button>
                        <button
                            className='hover:text-slate-300 mx-2'
                            onClick={() => openModal('privacy')}
                        >
                            Privacy Terms
                        </button>
                    </div>
                    <div className='flex space-x-4 text-white'>
                        <a target='_blank' href="https://x.com/" rel="noreferrer"><FaTwitter size={20} /></a>
                        <a target='_blank' href="https://www.instagram.com/" rel="noreferrer"><FaInstagram size={20} /></a>
                        <a target='_blank' href="https://www.facebook.com" rel="noreferrer"><FaFacebook size={20} /></a>
                    </div>
                </div>
            </footer>

            {/* About Modal */}
            <dialog
                ref={aboutRef}
                onClick={(e) => handleClickOutside(e, 'about')}
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 w-full max-w-md border shadow-lg backdrop:bg-black/50 transition-all duration-200 ease-out overflow-y-auto max-h-[80vh]
                    ${modalVisible.about ? "animate-popIn" : ""}`}
            >
                <h2 className='text-xl font-semibold mb-4'>About MatchIT</h2>
                <p>
                    MatchIT es una plataforma para recibir recomendación de películas basadas en las calificaciones que le das a las películas ayudando a encontrar
                    una película para disfrutar cada día en momentos de indecisión
                </p>
            </dialog>

            {/* Privacy Modal */}
            <dialog
                ref={privacyRef}
                onClick={(e) => handleClickOutside(e, 'privacy')}
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 w-full max-w-md border shadow-lg backdrop:bg-black/50 transition-all duration-200 ease-out overflow-y-auto max-h-[80vh]
                    ${modalVisible.privacy ? "animate-popIn" : ""}`}
            >
                <h2 className='text-xl font-semibold mb-4'>Privacy & Terms</h2>
                <p>
                    Respetamos tu privacidad. Tus datos se procesan con transparencia y responsabilidad.
                </p>
            </dialog>
        </>
    )
}

export default Footer

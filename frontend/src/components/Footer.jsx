import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className='bg-[#222222] py-7'>
            <div className='flex flex-col md:flex-row justify-between items-center mx-5 px-4'>
                <div className='text-sm'>
                    <span>© {currentYear} Mi App,Inc.</span>
                    <a className='hover:text-slate-300 mx-2' href="">About</a>
                    <a className='hover:text-slate-300 mx-2' href="">Privacy Terms</a>
                </div>
                <div className='flex space-x-4'>
                    <FaTwitter size={20}></FaTwitter>
                    <FaInstagram size={20}></FaInstagram>
                    <FaFacebook size={20}></FaFacebook>
                </div>
            </div>
        </footer>

    )
}

export default Footer
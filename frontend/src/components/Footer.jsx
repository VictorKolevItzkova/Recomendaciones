import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className='bg-[#222222] py-7'>
            <div className='flex flex-col md:flex-row justify-between items-center mx-5 px-4'>
                <div className='text-sm'>
                    <span>© {currentYear} MatchIT,Inc.</span>
                    <a className='hover:text-slate-300 mx-2' href="">About</a>
                    <a className='hover:text-slate-300 mx-2' href="">Privacy Terms</a>
                </div>
                <div className='flex space-x-4'>
                    <a target='_blank' href="https://x.com/"><FaTwitter size={20}></FaTwitter></a>
                    <a target='_blank' href="https://www.instagram.com/"><FaInstagram size={20}></FaInstagram></a>
                    <a target='_blank' href="https://www.facebook.com"><FaFacebook size={20}></FaFacebook></a>
                </div>
            </div>
        </footer>

    )
}

export default Footer
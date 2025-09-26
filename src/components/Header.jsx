import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import 'boxicons/css/boxicons.min.css';

const Header = () => {
    const { currentUser } = useAuth();

    const toggleMobileMenu = () => {
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
        }
    }

    const handleLogout = async () => {
        await signOut(auth);
    }


    return (
        <header className="flex justify-between items-center py-4 px-4 lg:px-20">
            <h1 data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="1000" className="text-3xl md:text-4xl lg:text-5xl font-light m-0">
                <Link to={"/"}>
                    INKDEX
                </Link>
            </h1>

            {/* Navigation Bar */}
            <nav className="hidden md:flex items-center gap-12">
                <Link data-aos="fade-down"
                    data-aos-easing="linear"
                    data-aos-duration="1500" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/explore">
                    Explore Notes
                </Link>
                <Link data-aos="fade-down"
                    data-aos-easing="linear"
                    data-aos-duration="2000" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/upload">
                    Upload Notes
                </Link>
                <Link data-aos="fade-down"
                    data-aos-easing="linear"
                    data-aos-duration="2500" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/notes">
                    Your Notes
                </Link>
            </nav>

            {currentUser ? (
                <div className="flex items-center gap-3 z-50">
                    <Link
                        to="/profile"
                        className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition"
                    >
                        {currentUser.displayName || currentUser.email}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white transition"
                        title="Logout"
                    >
                        <i className="bx bx-log-out-circle text-xl" />
                    </button>
                </div>
            ) : (
                <button className="hidden md:block bg-[#a7a7a7] text-black py-3 px-8 rounded-full border-none font-medium transition-all duration-500 hover:bg-white cursor-pointer z-50">
                    <Link to="/auth">
                        LOGIN   |   REGISTER
                    </Link>
                </button>
            )}

            {/* Mobile Menu Button - Visible only on Mobile */}
            <button onClick={toggleMobileMenu} className='md:hidden text-3xl p-2 z-50'>
                <i className='bx  bx-menu'></i>
            </button>

            {/* Mobile Menu - Hidden by default */}
            <div id='mobileMenu' className='hidden fixed top-16 bottom-0 right-0 left-0 p-5 md:hidden z-40 bg-black bg-opacity-70 backdrop-blur- md'>
                <nav className='flex flex-col gap-6 items-center'>
                    <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/explore">
                        Explore Notes
                    </Link>
                    <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/upload">
                        Upload Notes
                    </Link>
                    <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/notes">
                        Your Notes
                    </Link>
                </nav>
            </div>

        </header>
    )
}

export default Header
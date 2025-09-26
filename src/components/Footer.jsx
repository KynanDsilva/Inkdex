import React from 'react';

// Reusable link component
const FooterLink = ({ href, children }) => (
    <a 
        href={href} 
        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
    >
        {children}
    </a>
);

const Footer = () => {
    return (
        <footer className="bg-black text-white border-t border-gray-800"
                data-aos="fade-up" 
                data-aos-duration="1000"
        >
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* Top Section: Brand Identity and Community CTA */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 border-b border-gray-800 pb-8 mb-6">
                    
                    {/* Column 1: Brand Identity and Slogan */}
                    <div>
                        <h1 className="text-3xl font-light tracking-wider">
                            INKDEX
                        </h1>
                        <p className="mt-2 text-sm text-gray-400 max-w-sm">
                            The trusted notes sharing platform for college students.
                        </p>
                    </div>

                    {/* Column 2: Community and Connection (Discord CTA) */}
                    <div className="md:justify-self-end w-full md:max-w-xs">
                        <h3 className="text-base font-semibold text-white mb-4">Join the Community!</h3>
                        
                        {/* Discord Call to Action */}
                        <p className="text-gray-400 text-sm mb-4">
                            Connect with thousands of students across India for instant help and study resources.
                        </p>
                        
                        {/* Prominent Discord Button (using your existing button style) */}
                        <button className="w-full flex items-center justify-center bg-[#7289DA] text-white py-3 px-4 rounded-full font-medium transition-all duration-300 hover:bg-[#677BC4] cursor-pointer">
                            <i className='bx bxl-discord-alt text-xl mr-2'></i> 
                            JOIN DISCORD SERVER
                        </button>
                    </div>
                    
                </div>

                {/* Bottom Bar: Quick Links and Copyright */}
                <div className="pt-2">
                    {/* Secondary Navigation Links */}
                    <div className="flex space-x-6 mb-4 flex-wrap">
                        <FooterLink href="#">Available Notes</FooterLink>
                        <FooterLink href="#">Upload Notes</FooterLink>
                    </div>

                    {/* Copyright and Localized Tag */}
                    <div className="flex justify-between items-center pt-4 flex-wrap">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} INKDEX. All rights reserved.
                    </p>
                    {/* Optional Language Selector (Minimalist Utility) */}
                    <div className="text-sm text-gray-500">
                        <i className='bx bx-globe mr-1'></i> English (IN)
                    </div>
                </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
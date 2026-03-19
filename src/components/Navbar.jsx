import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5efe8] pt-0 pb-0 px-4 w-full shadow-sm">
      {/* Desktop Nav */}
      <div className="hidden md:flex flex-col items-center">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <img src={logo} alt="Teju & Auro" className="h-20 md:h-28 mx-auto select-none pointer-events-none" />
        </Link>
        <div className="mt-1 md:mt-2"></div>
        <ul className="flex gap-10 justify-center text-[#39372b] font-playfair text-lg md:text-xl uppercase tracking-wide">
          <li><Link to="/" className="hover:underline underline-offset-8 decoration-[#B993A5]">Home</Link></li>
          <li><Link to="/wedding-journey" className="hover:underline underline-offset-8 decoration-[#B993A5]">Our Wedding</Link></li>
          <li><Link to="/memories" className="hover:underline underline-offset-8 decoration-[#B993A5]">Memories</Link></li>
          <li><Link to="/gallery" className="hover:underline underline-offset-8 decoration-[#B993A5]">Gallery</Link></li>
          <li><Link to="/about" className="hover:underline underline-offset-8 decoration-[#B993A5]">About</Link></li>
        </ul>
      </div>
      {/* Mobile Nav */}
      <div className="relative flex md:hidden items-center h-20">
        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center w-full">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <img src={logo} alt="Teju & Auro" className="h-20 mx-auto select-none" />
          </Link>
        </div>
        {/* Hamburger Menu */}
        <button className="ml-auto p-2 z-10 relative" onClick={() => setOpen(true)} aria-label="Open menu">
          <div className="space-y-1">
            <span className="block w-8 h-1 bg-[#726c5c] rounded"></span>
            <span className="block w-8 h-1 bg-[#726c5c] rounded"></span>
            <span className="block w-8 h-1 bg-[#726c5c] rounded"></span>
          </div>
        </button>
      </div>
      {/* Side Drawer */}
      <div className={`fixed top-0 right-0 h-full w-4/5 bg-white shadow-lg z-50 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden overflow-y-auto max-h-screen`}>
        <button className="absolute top-5 right-5 text-3xl text-[#39372b]" aria-label="Close menu" onClick={() => setOpen(false)}>&times;</button>
        <div className="mt-20 px-8">
          <div className="mb-6">
            <span className="block font-playfair font-semibold text-xl text-[#39372b]">Teju &amp; Auro</span>
            <div className="text-[#39372b]/60 text-sm font-ebgaramond italic mt-2">Married August 8, 2025</div>
          </div>
          <ul className="flex flex-col gap-6 text-[#39372b] font-playfair text-lg uppercase tracking-wide">
            <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/wedding-journey" onClick={() => setOpen(false)}>Our Wedding</Link></li>
            <li><Link to="/memories" onClick={() => setOpen(false)}>Memories</Link></li>
            <li><Link to="/gallery" onClick={() => setOpen(false)}>Gallery</Link></li>
            <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
          </ul>
        </div>
      </div>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setOpen(false)}></div>}
    </nav>
  );
}

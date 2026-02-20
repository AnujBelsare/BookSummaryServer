import Link from 'next/link'
import React from 'react'
import './component.css'
function Navbar() {
    return (
        <nav className='glass-card flex justify-between items-center py-2 px-2 md:p-4 rounded-full border border-white/10'>
            <Link href={'/'} className='px-2' >
                <h1 className='font-semibold text-xl md:text-2xl'
                >Lumora
                </h1>
            </Link>
            <div className="signin-btn border border-white/10 
            rounded-full px-3 py-2 bg-accent
            text-background font-semibold"
            >Get Started
            </div>
        </nav>
    )
}

export default Navbar
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <section className='w-full h-screen py-2 px-2'>
      <nav className='flex justify-between items-center py-4 px-4 rounded-full border border-white/10'>
        <div ><h1 className='font-semibold text-xl md:text-2xl'>Lumora</h1></div>
        <div className="signin-btn border border-white/10 
            rounded-full px-3 py-2 bg-accent
            text-background font-semibold"
        >Get Started
        </div>
      </nav>

      <section className="main">
        <div className="linker flex gap-20 mt-20">
          <Link href='/editor' className="signin-btn border border-white/10 
              rounded-full px-3 py-2 bg-accent
              text-background font-semibold"
          >Editor.js
          </Link>
          <Link href='/book-adder' className="signin-btn border border-white/10 
              rounded-full px-3 py-2 bg-accent
              text-background font-semibold"
          >Form
          </Link>
        </div>
      </section>
    </section>
  )
}

export default page
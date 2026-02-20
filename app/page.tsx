import Link from 'next/link'
import React from 'react'
import BookShow from './component/BookShow'

function page() {
  return (
    <section className='w-full h-screen py-2 px-2'>

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

      <BookShow />
    </section>
  )
}

export default page
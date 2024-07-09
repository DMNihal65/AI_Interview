"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

    const router = useRouter();

    const path = usePathname();
    useEffect(() => {
        console.log(path);
    })

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-lg'>
        <Image src={"./logo.svg"} width={40} height={50} alt="logo"/>
        <ul className='hidden md:flex gap-4 ml-4  '>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard'&& 'text-primary font-bold'}`} onClick={()=>{router.push('/dashboard')}}>Dashboard</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/questions'&& 'text-primary font-bold'}`}>Questions</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/upgrade'&& 'text-primary font-bold'}`}>Upgrade</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/how'&& 'text-primary font-bold'}`}>How it works ?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header
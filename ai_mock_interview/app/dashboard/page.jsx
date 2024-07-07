import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

function Dashboard() {
  return (
    <div className='p-10'>
        <h2 className='font-bold text-2xl'>Dashboard</h2>
        <h2 className='text-slate-500'>Create and start your Ai Mock Interview and Get your Feedback in Seconds !  </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
            <AddNewInterview/>
        </div>

    </div>
  )
}

export default Dashboard
"use client"
import { db } from '@/utils/db'
import { userAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect } from 'react'

function Feedback({params}) {

    useEffect(()=>{
        GetFeedback();
    },[])

    

        const GetFeedback=async()=>{
            const result = await db.select()
            .from(userAnswer)
            .where(eq(userAnswer.mockIdRef,params.interviewId))
            .orderBy(userAnswer.id)

            console.log(result);
        }
    

  return (
    <div className='p-10'>

        <h2 className='text-3xl font-bold text-emerald-500 '>Congrats</h2>
        <h2 className='text-xl font-bold text-slate-600 '>Here is your Detailed Feedback on the Interview</h2>
        <h2 className='text-primary text-lg my-3'>Your Overall Interview Rating : <strong>7/10</strong></h2>

        <h2 className='text-sm text-slate-700'>Find below interview Questions with the correct answer and the feedback on the improvement</h2>
    </div>
  )
}

export default Feedback
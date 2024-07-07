"use client";
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewId);
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewData(result[0]);
    console.log(result[0]);
  };

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
      <div className='mt-5 flex flex-col my-5 gap-5 '>
        {interviewData ? (
          <div className='flex flex-col p-5 rounded-lg border bg-secondary gap-5 '>
          <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData.jobPostion}</h2>
            <h2 className='text-lg'><strong>Job Description:</strong> {interviewData.jobDesc}</h2>
            <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
            
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100 '>
                <h2 className='flex gap-2 items-center text-yellow-500 '><Lightbulb/><strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-600'>Losmsdfasfdafsdasdasdasdasdsadasdassadasdasdasd  sdfsadsa asdasdasda dsasdasd asdasdsad asdasdasd asdsadasdqweqwdasdas asdas</h2>
            </div>
          </div>
          
          
            
        ) : (
          <p>Loading interview details...</p>
        )}
        
      </div>

      <div>
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored
            style={{
              height: 300,
              width: 300,
            }}
          />
        ) : (
          <>
            <WebcamIcon className='h-72 w-full my-7 p-5 bg-secondary rounded-lg border' />
            <Button variant="ghost"className="hover:bg-primary border hover:text-white hover:shadow-lg hover:transition-all" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
          </>
        )}
      </div>
     

      </div>

     

      <div className='flex justify-end items-end'>
        <Button>Start</Button>
      </div>

    
    </div>
    
  );
}

export default Interview;

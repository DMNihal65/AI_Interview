"use client";
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
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
    <div className='container mx-auto my-10 px-6'>
      <h2 className='font-bold text-3xl text-center mb-8'>Let's Get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='flex flex-col my-5 gap-5'>
          {interviewData ? (
            <div className='flex flex-col p-5 rounded-lg border bg-secondary gap-5 shadow-lg'>
              <h2 className='text-lg font-semibold'><strong>Job Role/Job Position:</strong> {interviewData.jobPostion}</h2>
              <h2 className='text-lg'><strong>Job Description:</strong> {interviewData.jobDesc}</h2>
              <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
              
              <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100 shadow-inner'>
                <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-600'>Losmsdfasfdafsdasdasdasdasdsadasdassadasdasdasd  sdfsadsa asdasdasda dsasdasd asdasdsad asdasdasd asdsadasdqweqwdasdas asdas</h2>
              </div>
            </div>
          ) : (
            <p className='text-center'>Loading interview details...</p>
          )}
        </div>

        <div className='flex flex-col items-center'>
          {webCamEnabled ? (
            <Webcam
              className='my-5 bg-secondary border p-2 rounded-lg'
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored
              style={{
                height: 288,
                width: 600,
              }}
            />
          ) : (
            <>
              <WebcamIcon className='h-72 w-full my-7 p-5 bg-secondary rounded-lg border' />
              <Button variant="ghost" className="hover:bg-primary border hover:text-white hover:shadow-lg transition-all" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
            </>
          )}
        </div>
      </div>

      <div className='flex justify-end mt-8'>
      <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
      <Button className='px-6 py-2 text-lg'>Start</Button>
      
      </Link>
        </div>
    </div>
  );
}

export default Interview;

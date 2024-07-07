"use client"


// import { Button } from '@/components/button'
// import  Button  from '@/components/ui/butto/n'
// import { Button } from '@/Components/ui/button'
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { ChatSession } from '@google/generative-ai';
import { chatSession } from '@/utils/GeminiAiModle';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
// import clsx from 'clsx';



  

function AddNewInterview() {
  const [openDialog,setOpenDailog] = useState(false);

  const [jobPostion,setJobPostion] = useState();
  const [jobDesc,setJobDesc] = useState();
  const [jobExperience,setJobExperience] = useState();
  const [loading,setLoading] = useState(false);
  const [jsonResponse,setJsonResponse] = useState([]);
  const {user}=useUser();


  const onsubmit=async(e)=>{
    setLoading(true);
    e.preventDefault();
    const inputprompt = `Generate an interview questionnaire and answers in JSON format for the following job role and requirements. The JSON should include 5 questions and answers based on the job role, job description, tech stack, and years of experience provided below. Make sure the questions are relevant to the specified technologies and responsibilities. Job Role: ${jobPostion}, Job Description: ${jobDesc} The ideal candidate should have strong problem-solving skills, a passion for coding, and the ability to work in a fast-paced environment.Years of Experience: ${jobExperience}`;
    
    const result = await chatSession.sendMessage(inputprompt)
    console.log(jobPostion,jobDesc,jobExperience,)
    //Converting the text to JSON format
    const formattedResponse = (result.response.text()).replace('```json',"").replace('```',"")
    console.log(JSON.parse(formattedResponse))
    setJsonResponse(formattedResponse);

    if(formattedResponse){
    const response = await db.insert(MockInterview).values(
      {
        mockId:uuidv4(),
        jobPostion:jobPostion,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        jsonMockResp:jsonResponse,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-yyyy'),
    
      }
    ).returning({mockId:MockInterview.mockId})

    console.log("inserted ID: " ,response)
  }
  else{
    console.log("ERROR")
  }
    setLoading(false);
  }



  
  return (
    <div>
        <div className='bg-secondary p-5 border rounded-lg  hover:scale-105 hover:shadow-lg transition-all
        '
        onClick={()=>setOpenDailog(true)}>
            <h2 className='font-bold text-lg text-slate-600 text-center' >+ Add New Interview</h2>
        </div>
        <Dialog open={openDialog}>
 
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className='font-bold text-2xl'>Tell us more about the job you are interviewing</DialogTitle>
            <DialogDescription>
            <form onSubmit={onsubmit}>
                <div>
                    
                    <h2>Add More Details about your job position/role, Job Discription and Years of Experice</h2>

                    <div className='mt-7 my-2'>
                        <label>Job Role/Job Position</label>
                        <Input placeholder="Ex. Full Stack Devloper" 
                        required
                        onChange={(event)=>setJobPostion(event.target.value)}
                        />
                    </div>

                    <div className='my-3'>
                        <label>Job Discription/Tech Stack (In Short)</label>
                        <Textarea placeholder="Ex. React, Angular, Nodejs, Python etc."
                         required
                         onChange={(event)=>setJobDesc(event.target.value)}
                         ></Textarea>
                    </div>

                    <div className='my-3'>
                        <label>Years of Experice</label>
                        <Input placeholder="Ex. 5" type="number" max="20" 
                        required
                        onChange={(event)=>setJobExperience(event.target.value)}
                        ></Input>
                    </div>
                </div>
               <div className='flex gap-5 justify-end'>
                <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancle</Button>
                <Button type="submit" disabled={loading}
                >
                {loading?<><LoaderCircle className='animate-spin'/>Generating Questions</>:"Start Interview"}
                </Button>
              </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>


    </div>
  )
}

export default AddNewInterview
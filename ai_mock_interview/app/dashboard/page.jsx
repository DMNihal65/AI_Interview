import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Clock, Trophy, BarChart } from 'lucide-react'

function Dashboard() {
  return (
    <div className=' mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0'>
        <div>
          <h1 className='font-bold text-3xl sm:text-4xl text-primary'>Dashboard</h1>
          <p className='text-slate-500 mt-2 text-sm sm:text-base'>Create and start your AI Mock Interview and get feedback in seconds!</p>
        </div>
        {/* <UserButton afterSignOutUrl="/" /> */}
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8'>
        <DashboardCard icon={<Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />} title="Total Interviews" value="12" />
        <DashboardCard icon={<Clock className="h-6 w-6 sm:h-8 sm:w-8" />} title="Avg. Duration" value="25 min" />
        <DashboardCard icon={<Trophy className="h-6 w-6 sm:h-8 sm:w-8" />} title="Best Score" value="9.2/10" />
        <DashboardCard icon={<BarChart className="h-6 w-6 sm:h-8 sm:w-8" />} title="Progress" value="+15%" />
      </div>

      <div >
          <AddNewInterview />
        </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 my-4'>
      
        <div className='lg:col-span-4'>
          <InterviewList />
        </div>
        
      </div>
    </div>
  )
}

function DashboardCard({ icon, title, value }) {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  )
}

export default Dashboard
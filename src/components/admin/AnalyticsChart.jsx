import React from 'react';
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,LineChart,Line,PieChart,Pie,Cell}from'recharts';

const COLORS=['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

export const BarChartComponent=({data,xKey='name',yKey='avgScore',title})=>(
  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
    {title&&<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>{title}</h3>}
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}><CartesianGrid strokeDasharray='3 3' stroke='#374151' opacity={0.3}/><XAxis dataKey={xKey} tick={{fontSize:12}} stroke='#9ca3af'/><YAxis stroke='#9ca3af'/><Tooltip contentStyle={{backgroundColor:'#1f2937',border:'none',borderRadius:'8px',color:'#f3f4f6'}}/><Bar dataKey={yKey} fill='#6366f1' radius={[4,4,0,0]}/></BarChart>
    </ResponsiveContainer>
  </div>
);

export const LineChartComponent=({data,xKey='date',yKey='attempts',title})=>(
  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
    {title&&<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>{title}</h3>}
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data}><CartesianGrid strokeDasharray='3 3' stroke='#374151' opacity={0.3}/><XAxis dataKey={xKey} tick={{fontSize:10}} stroke='#9ca3af'/><YAxis stroke='#9ca3af'/><Tooltip contentStyle={{backgroundColor:'#1f2937',border:'none',borderRadius:'8px',color:'#f3f4f6'}}/><Line type='monotone' dataKey={yKey} stroke='#10b981' strokeWidth={2} dot={false}/></LineChart>
    </ResponsiveContainer>
  </div>
);

export const PieChartComponent=({data,title})=>(
  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
    {title&&<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>{title}</h3>}
    <ResponsiveContainer width='100%' height={300}>
      <PieChart><Pie data={data} cx='50%' cy='50%' outerRadius={100} dataKey='value' label={({name,percent})=>name+' '+Math.round(percent*100)+'%'}>
        {data.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
      </Pie><Tooltip/></PieChart>
    </ResponsiveContainer>
  </div>
);

export default{BarChartComponent,LineChartComponent,PieChartComponent};

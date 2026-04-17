import React from 'react';
import Editor from'@monaco-editor/react';
import{Play,Trash2}from'lucide-react';
import Spinner from'../ui/Spinner';
import Badge from'../ui/Badge';
const CodeEditorPanel=({value,onChange,onRun,output,isRunning=false,readOnly=false,height='300px'})=>{
  return(
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
      <div className='flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700'>
        <Badge variant='code' size='sm'>JavaScript</Badge>
        {!readOnly&&<button onClick={onRun} disabled={isRunning} className='flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors disabled:opacity-50'>
          {isRunning?<Spinner size='sm' className='text-white'/>:<Play size={14}/>}{isRunning?'Running...':'Run'}
        </button>}
      </div>
      <Editor height={height} language='javascript' theme='vs-dark' value={value} onChange={readOnly?undefined:onChange}
        options={{fontSize:14,minimap:{enabled:false},scrollBeyondLastLine:false,readOnly,automaticLayout:true,tabSize:2,wordWrap:'on',padding:{top:12}}}/>
      {(output||isRunning)&&<div className='border-t border-gray-700 bg-gray-900'>
        <div className='flex items-center justify-between px-4 py-2 border-b border-gray-700'>
          <span className='text-xs font-medium text-gray-400'>Output</span>
          {output&&output.durationMs!=null&&<span className='text-xs text-gray-500'>Done in {output.durationMs}ms</span>}
        </div>
        <div className='p-4 min-h-[80px] max-h-[200px] overflow-y-auto font-mono text-sm'>
          {isRunning?<div className='flex items-center gap-2 text-gray-400'><Spinner size='sm'/>Executing...</div>
          :output&&output.error?<pre className='text-red-400 whitespace-pre-wrap'>{output.error}</pre>
          :<pre className='text-green-400 whitespace-pre-wrap'>{output?output.output:'(no output)'}</pre>}
        </div>
      </div>}
    </div>
  );
};
export default CodeEditorPanel;

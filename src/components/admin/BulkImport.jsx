import React,{useState,useRef}from'react';
import{Upload,FileText,CheckCircle,AlertCircle}from'lucide-react';
import Button from'../ui/Button';
import{questionsAPI}from'../../api/questionsAPI';
import toast from'react-hot-toast';

const BulkImport=({onClose,onSuccess})=>{
  const[file,setFile]=useState(null);
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const inputRef=useRef(null);

  const handleDrop=(e)=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)setFile(f);};
  const handleDragOver=(e)=>e.preventDefault();

  const handleImport=async()=>{
    if(!file){toast.error('Select a file first');return;}
    setLoading(true);
    try{const r=await questionsAPI.bulkImport(file);setResult(r.data);toast.success('Import complete!');if(onSuccess)onSuccess();}
    catch(e){toast.error(e?.response?.data?.message||'Import failed');}
    finally{setLoading(false);}
  };

  if(result)return(
    <div className='text-center py-8'>
      <CheckCircle size={48} className='mx-auto mb-4 text-success-500'/>
      <h3 className='text-lg font-semibold mb-2'>Import Complete</h3>
      <p className='text-sm text-gray-500 mb-1'>Imported: {result.imported}</p>
      <p className='text-sm text-gray-500 mb-4'>Failed: {result.failed||0}</p>
      <Button onClick={onClose}>Close</Button>
    </div>
  );

  return(
    <div className='space-y-4'>
      <div onDrop={handleDrop} onDragOver={handleDragOver} onClick={()=>inputRef.current?.click()}
        className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors'>
        <Upload size={32} className='mx-auto mb-3 text-gray-400'/>
        <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Drop CSV/JSON file here or click to browse</p>
        <p className='text-xs text-gray-500 mt-1'>Supports .csv and .json files</p>
        <input ref={inputRef} type='file' accept='.csv,.json' onChange={e=>{if(e.target.files[0])setFile(e.target.files[0]);}} className='hidden'/>
      </div>
      {file&&<div className='flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
        <FileText size={20} className='text-primary-500'/><div className='flex-1'><p className='text-sm font-medium'>{file.name}</p><p className='text-xs text-gray-500'>{(file.size/1024).toFixed(1)} KB</p></div>
        <button onClick={()=>setFile(null)} className='text-gray-400 hover:text-danger-500 text-sm'>Remove</button>
      </div>}
      <div className='flex gap-3'>
        <Button variant='secondary' onClick={onClose}>Cancel</Button>
        <Button onClick={handleImport} loading={loading} disabled={!file}>Import Questions</Button>
      </div>
    </div>
  );
};
export default BulkImport;

import { create } from 'zustand';
export const useExamStore = create((set, get) => ({
  attemptId:null,examMeta:{},questions:[],answers:{},flagged:[],currentIndex:0,timeRemainingSeconds:0,isSubmitting:false,codeOutputs:{},
  initExam:(attemptId,questions,timeLimitSecs,examMeta)=>set({attemptId,questions,examMeta,answers:{},flagged:[],currentIndex:0,timeRemainingSeconds:timeLimitSecs,isSubmitting:false,codeOutputs:{}}),
  setAnswer:(qid,val)=>set((s)=>({answers:{...s.answers,[qid]:val}})),
  toggleFlag:(qid)=>set((s)=>({flagged:s.flagged.includes(qid)?s.flagged.filter(i=>i!==qid):[...s.flagged,qid]})),
  goToQuestion:(i)=>{if(i>=0&&i<get().questions.length)set({currentIndex:i});},
  nextQuestion:()=>{const{currentIndex,questions}=get();if(currentIndex<questions.length-1)set({currentIndex:currentIndex+1});},
  prevQuestion:()=>{const{currentIndex}=get();if(currentIndex>0)set({currentIndex:currentIndex-1});},
  setCodeOutput:(qid,r)=>set((s)=>({codeOutputs:{...s.codeOutputs,[qid]:r}})),
  tickTimer:()=>set((s)=>({timeRemainingSeconds:Math.max(0,s.timeRemainingSeconds-1)})),
  setSubmitting:(b)=>set({isSubmitting:b}),
  resetExam:()=>set({attemptId:null,examMeta:{},questions:[],answers:{},flagged:[],currentIndex:0,timeRemainingSeconds:0,isSubmitting:false,codeOutputs:{}}),
}));

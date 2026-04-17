export const validateEmail=(e)=>{if(!e)return'Email is required';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return'Invalid email';return'';};
export const validatePassword=(p)=>{if(!p)return'Password is required';if(p.length<6)return'Min 6 characters';return'';};
export const validateConfirmPassword=(p,c)=>{if(!c)return'Confirm password';if(p!==c)return'Passwords do not match';return'';};
export const validateName=(n)=>{if(!n)return'Name is required';if(n.trim().length<2)return'Min 2 characters';return'';};
export const validateRequired=(v,f='This field')=>(!v||(typeof v==='string'&&!v.trim()))?f+' is required':'';

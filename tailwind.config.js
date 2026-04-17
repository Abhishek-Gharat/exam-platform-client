export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:{50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81'},
        success:{50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857'},
        warning:{50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309'},
        danger:{50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c'}
      },
      fontFamily:{sans:['Inter','system-ui','sans-serif']},
      animation:{'slide-in':'slideIn .3s ease-out','fade-in':'fadeIn .2s ease-out'},
      keyframes:{slideIn:{'0%':{transform:'translateY(-10px)',opacity:'0'},'100%':{transform:'translateY(0)',opacity:'1'}},fadeIn:{'0%':{opacity:'0'},'100%':{opacity:'1'}}}
    }
  },
  plugins:[]
};

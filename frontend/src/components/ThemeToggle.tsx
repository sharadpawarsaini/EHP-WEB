import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white dark:bg-emerald-950/20 text-slate-800 dark:text-emerald-400 hover:scale-110 transition-all shadow-xl border border-slate-100 dark:border-emerald-500/20 group relative overflow-hidden"
      aria-label="Toggle Theme"
    >
      <div className="absolute inset-0 bg-primary-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 180 : 0,
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {theme === 'dark' ? <Moon className="h-5 w-5 fill-emerald-400/20" /> : <Sun className="h-5 w-5 fill-amber-400/20" />}
      </motion.div>
    </button>
  );
};

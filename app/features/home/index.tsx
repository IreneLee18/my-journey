import { motion } from 'framer-motion';

export default function Homepage() {
  const text = 'Hi this is Irene, Welcome to my journey.';
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {text.split('').map((char, index) => {
              return (
                <motion.span
                  key={`${char}-${index}`}
                  variants={child}
                  className="inline-block"
                  style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </motion.span>
        </h1>
      </div>
    </div>
  );
}

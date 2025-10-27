import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/useTranslation';

export default function Homepage() {
  const { t, language } = useTranslation();
  
  // 桌机版：完整文字
  const desktopText = t('home.greeting.desktop');
  // 手机版：分成两行
  const mobileTextLine1 = t('home.greeting.mobile.line1');
  const mobileTextLine2 = t('home.greeting.mobile.line2');
  
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

  const renderAnimatedText = (text: string) => {
    return text.split('').map((char, index) => {
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
    });
  };

  return (
    <div className="container flex-1 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 桌机版：完整文字，不分行 */}
        <h1 className="hidden md:block md:text-4xl lg:text-6xl font-bold mb-4">
          <motion.span
            key={`desktop-${language}`}
            variants={container}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {renderAnimatedText(desktopText)}
          </motion.span>
        </h1>


        {/* 手机版：文字变小且分行 */}
        <h1 className="block md:hidden text-2xl font-bold mb-4">
          <motion.span
            key={`mobile-${language}`}
            variants={container}
            initial="hidden"
            animate="visible"
            className="block"
          >
            <span className="block mb-2">
              {renderAnimatedText(mobileTextLine1)}
            </span>
            <span className="block">
              {renderAnimatedText(mobileTextLine2)}
            </span>
          </motion.span>
        </h1>
      </div>
    </div>
  );
}

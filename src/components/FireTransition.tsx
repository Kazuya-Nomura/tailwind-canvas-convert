import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FireTransition = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to various animation values
  const fireOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.4, 0.8, 1]);
  const smokeOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0.1, 0.3, 0.6, 0.9]);
  const emberScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 1.5]);
  const backdropBlur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 2, 8]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base smoke layer */}
      <motion.div 
        className="absolute inset-0 bg-smoke-gradient opacity-90"
        style={{ opacity: smokeOpacity }}
      />
      
      {/* Animated fire effect layers */}
      <motion.div 
        className="absolute inset-0"
        style={{ opacity: fireOpacity, backdropFilter: `blur(${backdropBlur}px)` }}
      >
        {/* Fire gradient overlay */}
        <div className="absolute inset-0 bg-fire-gradient opacity-60 fire-animation" />
        
        {/* Floating embers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-fire-ember rounded-full ember-animation"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${60 + Math.sin(i) * 20}%`,
              scale: emberScale,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Smoke particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`smoke-${i}`}
            className="absolute w-8 h-8 bg-muted/20 rounded-full smoke-animation blur-sm"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${70 + Math.cos(i) * 15}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </motion.div>
      
      {/* Dynamic fire flickers */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-fire-ember/30 to-transparent"
        style={{ 
          opacity: fireOpacity,
          scaleY: emberScale 
        }}
      />
    </div>
  );
};

export default FireTransition;
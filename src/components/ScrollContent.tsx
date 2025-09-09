import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ScrollContent = () => {
  const { scrollYProgress } = useScroll();
  
  // Transform values for text animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const scrollMsgOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <motion.section 
        className="min-h-screen flex flex-col items-center justify-center text-center px-4"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-foreground text-fire-glow mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          HELLO <span className="inline-block animate-pulse">👋</span>
        </motion.h1>
        
        <motion.div 
          className="flex flex-col items-center space-y-4"
          style={{ opacity: scrollMsgOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="text-xl text-muted-foreground">scroll me</p>
          <ChevronDown className="w-6 h-6 text-accent animate-bounce" />
        </motion.div>
      </motion.section>

      {/* Content Section */}
      <motion.section 
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ opacity: contentOpacity }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div 
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-smoke"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-6">How it's done</h2>
            <div className="space-y-4 text-foreground/90">
              <p>
                The HTML content you're reading right now is overlaid with a full-screen <strong>canvas</strong> element.
                There is a fragment shader that defines opacity and color for each pixel of the <strong>canvas</strong>.
              </p>
              <p>
                Shader input values are <strong>animation progress</strong>, <strong>time</strong>, and <strong>resolution</strong>.
              </p>
              <p>
                While <strong>time</strong> and <strong>window size (resolution)</strong> are super easy to gather, for <strong>animation progress</strong> I use <a href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 underline">GSAP ScrollTrigger</a> plugin.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-smoke"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4 text-foreground/90">
              <p>
                Once the inputs are prepared, we pass them as uniforms to the shader.
                The WebGL part of this demo is a basic JS boilerplate to render a fragment shader on the single full-screen plane. No extra libraries here.
              </p>
              <p>
                The fragment shader is based on <a href="https://thebookofshaders.com/13/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 underline">Fractal Brownian Motion (fBm)</a> noise.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-smoke"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4 text-foreground/90">
              <p>
                First, we create a semi-transparent mask to define a contour of burning paper. It is basically a low-scale fBm noise with <strong>animation progress</strong> value used as a threshold.
              </p>
              <p>Taking the same fBm noise with different thresholds we can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>(a)</strong> darken parts of the paper so each pixel gets darker before turning transparent</li>
                <li><strong>(b)</strong> define the stripe along the paper edge for fire.</li>
              </ul>
              <p>
                The fire is done as another two fBm based functions, one for shape and one for color. Both have a higher scale and both are animated with <strong>time</strong> value instead of <strong>animation progress</strong>.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="text-center pt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <a href="https://www.linkedin.com/in/ksenia-kondrashova/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">linkedIn</a>
              <span>|</span>
              <a href="https://codepen.io/ksenia-k" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">codepen</a>
              <span>|</span>
              <a href="https://twitter.com/uuuuuulala" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">twitter (X)</a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ScrollContent;
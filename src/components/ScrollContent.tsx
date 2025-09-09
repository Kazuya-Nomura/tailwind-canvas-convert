import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

const ScrollContent = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const scrollMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = heroRef.current;
    const content = contentRef.current;
    const scrollMsg = scrollMsgRef.current;

    if (!hero || !content || !scrollMsg) return;

    // Hero section animation
    gsap.to(hero, {
      opacity: 0,
      scale: 0.8,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "50% top",
        scrub: true
      }
    });

    // Scroll message fade out
    gsap.to(scrollMsg, {
      opacity: 0,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "20% top",
        scrub: true
      }
    });

    // Content section reveal
    gsap.fromTo(content, 
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: document.body,
          start: "40% top",
          end: "60% top",
          scrub: true
        }
      }
    );

    // Content cards animation
    const cards = content.querySelectorAll('.content-card');
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 50%",
            scrub: true
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative z-0">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8">
          HELLO <span className="inline-block animate-bounce">👋</span>
        </h1>
        
        <div 
          ref={scrollMsgRef}
          className="flex flex-col items-center space-y-4"
        >
          <p className="text-xl text-muted-foreground">scroll me</p>
          <ChevronDown className="w-6 h-6 text-accent animate-bounce" />
        </div>
      </section>

      {/* Content Section */}
      <section 
        ref={contentRef}
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="content-card bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-lg">
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
          </div>

          <div className="content-card bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-lg">
            <div className="space-y-4 text-foreground/90">
              <p>
                Once the inputs are prepared, we pass them as uniforms to the shader.
                The WebGL part of this demo is a basic JS boilerplate to render a fragment shader on the single full-screen plane. No extra libraries here.
              </p>
              <p>
                The fragment shader is based on <a href="https://thebookofshaders.com/13/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 underline">Fractal Brownian Motion (fBm)</a> noise.
              </p>
            </div>
          </div>

          <div className="content-card bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-lg">
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
          </div>

          <div className="text-center pt-16">
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <a href="https://www.linkedin.com/in/ksenia-kondrashova/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">linkedIn</a>
              <span>|</span>
              <a href="https://codepen.io/ksenia-k" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">codepen</a>
              <span>|</span>
              <a href="https://twitter.com/uuuuuulala" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">twitter (X)</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollContent;
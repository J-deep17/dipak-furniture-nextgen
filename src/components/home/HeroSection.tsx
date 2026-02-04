import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, ChevronLeft, Phone, MessageCircle, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchHeroBanners } from "@/lib/api";
import type { HeroBanner } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: banners = [], isLoading } = useQuery<HeroBanner[]>({
    queryKey: ['hero-banners'],
    queryFn: fetchHeroBanners,
  });

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length, nextSlide]);

  const handleNext = () => {
    nextSlide();
    setIsAutoPlaying(false);
  };

  const handlePrev = () => {
    prevSlide();
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const getTransitionVariants = (effect?: string) => {
    switch (effect) {
      case 'slide-left':
        return {
          initial: { x: "100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "-100%", opacity: 0 },
          transition: { duration: 0.8, ease: "easeInOut" as const }
        };
      case 'slide-right':
        return {
          initial: { x: "-100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "100%", opacity: 0 },
          transition: { duration: 0.8, ease: "easeInOut" as const }
        };
      case 'zoom-in':
        return {
          initial: { scale: 1.15, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          transition: { duration: 1, ease: "easeOut" as const }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 1.2, ease: "easeInOut" as const }
        };
    }
  };

  const getImageAnimation = (effect?: string) => {
    switch (effect) {
      case 'zoom-in':
        return {
          initial: { scale: 1 },
          animate: { scale: 1.1 },
          transition: { duration: 8, ease: "linear" as const, repeat: Infinity, repeatType: "reverse" as const }
        };
      case 'zoom-out':
        return {
          initial: { scale: 1.1 },
          animate: { scale: 1 },
          transition: { duration: 8, ease: "linear" as const, repeat: Infinity, repeatType: "reverse" as const }
        };
      case 'subtle-pan':
        return {
          initial: { x: "-2%", scale: 1.05 },
          animate: { x: "2%", scale: 1.05 },
          transition: { duration: 10, ease: "linear" as const, repeat: Infinity, repeatType: "reverse" as const }
        };
      default:
        return {
          initial: { scale: 1, x: 0 },
          animate: { scale: 1, x: 0 },
          transition: { duration: 0 }
        };
    }
  };

  if (isLoading) {
    return (
      <section className="relative min-h-[70vh] md:min-h-[85vh] overflow-hidden bg-slate-900 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading Premium Collection...</div>
      </section>
    );
  }

  // Default content if no banners
  if (banners.length === 0) {
    return (
      <section className="relative min-h-[70vh] md:min-h-[85vh] overflow-hidden bg-gradient-to-br from-primary via-primary to-slate-800 flex items-center">
        <div className="container relative z-10 py-12 md:py-20 text-center lg:text-left">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-7xl">
              Premium Office Furniture Manufacturer
            </h1>
            <p className="text-lg text-white/80">
              Crafting ergonomic excellence for modern workspaces since 1998.
            </p>
            <Button size="lg" asChild>
              <Link to="/products">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];
  const trans = getTransitionVariants(currentBanner.transitionEffect);
  const imgAnim = getImageAnimation(currentBanner.imageEffect);

  return (
    <section
      className="relative h-auto min-h-[55vh] md:min-h-[70vh] lg:min-h-[85vh] overflow-hidden group bg-slate-900"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner._id}
          initial={trans.initial}
          animate={trans.animate}
          exit={trans.exit}
          transition={trans.transition}
          className="absolute inset-0"
        >
          {/* Background Image Layer with its own animation */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            initial={imgAnim.initial}
            animate={imgAnim.animate}
            transition={imgAnim.transition}
            style={{
              backgroundImage: `url(${currentBanner.image})`,
            }}
          >
            {/* Hotspots MUST be INSIDE the image animation layer to stay relative to image features */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              <TooltipProvider delayDuration={0}>
                {currentBanner.hotspots?.map((hotspot, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (idx * 0.1), duration: 0.5 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={hotspot.productId ? `/product/${hotspot.productId}` : (hotspot.productUrl || '#')}
                        >
                          <motion.div
                            className="group relative flex items-center justify-center w-[30px] h-[30px] md:w-[34px] md:h-[34px] bg-accent rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3)] cursor-pointer border-2 border-white/50"
                            animate={{
                              boxShadow: ["0 0 0 0px rgba(245, 158, 11, 0.4)", "0 0 0 12px rgba(245, 158, 11, 0)", "0 0 0 0px rgba(245, 158, 11, 0)"],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          </motion.div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        sideOffset={12}
                        className="bg-slate-900/95 backdrop-blur-md border-none text-white px-4 py-2 rounded-lg shadow-2xl"
                      >
                        <p className="text-xs font-bold uppercase tracking-wider">
                          {hotspot.label || 'View Details'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </TooltipProvider>
            </div>
          </motion.div>

          {/* Precise Typography-First Overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 100%)'
            }}
          />

          {/* Content Container with Precise Spacing */}
          <div className="container relative z-20 h-full flex flex-col justify-center pt-20 pb-[60px] md:pb-[80px] lg:pb-[96px] px-6 sm:px-12">
            {banners[currentSlide].title && (
              <div className="max-w-[700px] space-y-7">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="space-y-6"
                >
                  <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wide border border-accent/20 uppercase">
                    Established 1998 • Ahmedabad
                  </span>
                  <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] md:leading-[1.15] tracking-tight">
                    {banners[currentSlide].title}
                  </h1>
                  {banners[currentSlide].subtitle && (
                    <p className="text-base sm:text-lg text-white/90 leading-relaxed font-medium">
                      {banners[currentSlide].subtitle}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full transition-all hover:scale-105"
                  >
                    <Link to={banners[currentSlide].buttonLink || '/products'}>
                      {banners[currentSlide].buttonText || 'Discover More'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 rounded-full"
                  >
                    <Link to="/contact">Request Catalog</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-6 bg-[#25D366] text-white hover:bg-[#25D366]/90 rounded-full"
                  >
                    <a
                      href="https://wa.me/919824044585"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat with Us
                    </a>
                  </Button>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="flex items-center gap-8 pt-6 border-t border-white/10"
                >
                  <div>
                    <p className="text-2xl font-bold text-accent">25k+</p>
                    <p className="text-xs text-white/60 uppercase tracking-widest">Projects Delivered</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-2xl font-bold text-accent">500+</p>
                    <p className="text-xs text-white/60 uppercase tracking-widest">Corporate Clients</p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>


        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/20 text-white backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/20 text-white backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Progress Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-3">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === idx ? "w-10 bg-accent" : "w-4 bg-white/30 hover:bg-white/50"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;

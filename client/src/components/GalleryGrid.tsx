import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import stakingImage from "@assets/staking-shark.png";
import theatreImage from "@assets/shark-cinema.png";
import pumpImage from "@assets/shacko-pump.png";

interface GalleryImage {
  src: string;
  alt: string;
  span: string;
  description?: string;
  comingSoon?: boolean;
}

const images: GalleryImage[] = [
  { 
    src: stakingImage, 
    alt: "Staking", 
    span: "col-span-1 md:col-span-2 row-span-2",
    description: "Stake your SHACKO tokens",
    comingSoon: true
  },
  { 
    src: theatreImage, 
    alt: "SHACKO Theatre", 
    span: "col-span-1 md:col-span-2",
    description: "Grow, feed & customise your shacks",
    comingSoon: true
  },
  { 
    src: pumpImage, 
    alt: "Shacko Pump", 
    span: "col-span-1 md:col-span-2",
    description: "Your trusted companion that will help you navigate the Crypto market like a pro",
    comingSoon: true
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function GalleryGrid() {
  const { toast } = useToast();

  const handleImageClick = (img: GalleryImage) => {
    if (img.comingSoon) {
      toast({
        title: "Coming Soon!",
        description: `${img.alt} is coming soon. Stay tuned!`,
        className: "bg-[#38bdf8] border-2 border-black text-white font-[Fredoka]",
      });
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-[#7dd3fc] to-[#38bdf8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-[Bangers] text-white text-stroke mb-4"
          >
            THE VIBES
          </motion.h2>
          <p className="text-2xl font-bold text-slate-700 max-w-2xl mx-auto">
            Step into the deep blue with the wildest sharks in the metaverse.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-6"
        >
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ scale: 1.02, rotate: 1 }}
              onClick={() => handleImageClick(img)}
              className={`relative group rounded-3xl overflow-hidden border-4 border-black comic-shadow bg-[#1e3a5f] cursor-pointer ${img.span}`}
              data-testid={`gallery-item-${idx}`}
            >
              <div className="absolute inset-0 bg-[#38bdf8]/0 group-hover:bg-[#38bdf8]/10 transition-colors z-10 duration-300" />
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-contain object-center transform transition-transform duration-500 group-hover:scale-110 p-4"
              />
              {img.comingSoon && (
                <div className="absolute top-4 right-4 bg-[#ec4899] text-white font-[Bangers] text-lg px-4 py-2 rounded-xl border-2 border-black z-20">
                  COMING SOON
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                <span className="text-white font-[Bangers] text-2xl tracking-wide block">{img.alt}</span>
                {img.description && (
                  <span className="text-white/80 font-[Fredoka] text-sm">{img.description}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

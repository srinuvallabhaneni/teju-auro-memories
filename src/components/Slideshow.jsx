import React, { useState } from 'react';

const images = [
  '/images/IMG_1.jpg',
  '/images/IMG_5.jpg',
  '/images/IMG_3.jpg',
  '/images/IMG_4.jpg',
];

export default function Slideshow() {
  // Repeat images for seamless loop (double for seamless)
  const imagesToRender = [...images, ...images];
  const [loadedCount, setLoadedCount] = useState(0);
  const allLoaded = loadedCount >= imagesToRender.length;

  return (
    <div
      className={`w-full h-[24rem] md:h-[40rem] flex items-center justify-center bg-pink-50 mb-16 overflow-x-hidden relative mt-3 transition-opacity duration-700 ${allLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`flex items-center w-full h-full ${allLoaded ? 'animate-slideshow' : ''}`}
        style={{ height: '100%' }}
      >
        {imagesToRender.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slideshow ${idx % images.length + 1}`}
            className="flex-shrink-0"
            style={{
              width: 'auto',
              height: '100%',
              maxHeight: '100%',
              border: 'none',
              margin: 0,
              padding: 0,
              display: 'block',
            }}
            loading="lazy"
            draggable={false}
            onLoad={() => setLoadedCount(c => c + 1)}
          />
        ))}
      </div>
      <style>{`
        @keyframes slideshow {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-100%,0,0); }
        }
        @keyframes slideshow-mobile {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-600%,0,0); }
        }
        .animate-slideshow {
          animation: slideshow 48s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-slideshow {
            animation: slideshow-mobile 60s linear infinite;
          }
        }
      `}</style>
    </div>
  );
}

//   const [allLoaded, setAllLoaded] = useState(false);
//   const [transition, setTransition] = useState(true);
//   const imgRefs = useRef([]);

//   // Measure image widths after load
//   useEffect(() => {
//     setImgWidths(imgRefs.current.map(img => img ? img.offsetWidth : 0));
//     // Check if all images are loaded
//     if (imgRefs.current.every(img => img && img.complete)) {
//       setAllLoaded(true);
//     }
//   }, [images]);

//   // Compute total width of all images
//   const totalWidth = imgWidths.reduce((a, b) => a + b, 0);

//   // Infinite scroll logic
//   useEffect(() => {
//     if (!allLoaded || totalWidth === 0) return;
//     let raf;
//     function animate() {
//       setOffset(prev => {
//         const next = prev + slideSpeed;
//         if (next >= totalWidth) {
//           setTransition(false); // disable transition for this frame
//           return next - totalWidth;
//         } else {
//           setTransition(true);
//           return next;
//         }
//       });
//       raf = requestAnimationFrame(animate);
//     }
//     raf = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(raf);
//   }, [totalWidth, slideSpeed, allLoaded]);

//   return (
//     <div ref={containerRef} className="w-full h-[32rem] md:h-[48rem] md:max-w-[1200px] flex items-center justify-center bg-pink-50 mb-16 overflow-x-auto min-w-fit relative mt-3">
//     <div
//       className="flex items-center"
//       style={{
//         transform: `translateX(-${Math.round(offset)}px)`,
//         willChange: 'transform',
//         transition: transition ? 'transform 0.1s linear' : 'none',
//         width: totalWidth ? totalWidth * 3 : 'auto',
//       }}
//     >
//       {[...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images].map((img, idx) => (
//         <img
//           key={idx}
//           ref={el => (imgRefs.current[idx] = el)}
//           src={img}
//           alt={`Slideshow ${idx % totalImages + 1}`}
//           className="object-contain object-center h-[32rem] md:h-[48rem] md:w-auto block mx-auto transition-all duration-300 object-center"
//           style={{ maxHeight: '100%', border: 'none', margin: 0, padding: 0 }}
//           onLoad={() => {
//               setImgWidths(imgRefs.current.map(img => img ? img.offsetWidth : 0));
//               if (imgRefs.current.every(img => img && img.complete)) setAllLoaded(true);
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
//         'slide-left': 'slide-left 10s linear infinite',
//       },
//     },
//   },
// };

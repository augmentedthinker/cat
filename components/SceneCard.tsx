import React, { useMemo } from 'react';
import { StoryNode, StoryChoice } from '../types';
import { Button } from './Button';

interface SceneCardProps {
  node: StoryNode;
  isActive: boolean;
  isPast: boolean;
  onChoice: (choice: StoryChoice) => void;
  onBack?: () => void;
  seed: number;
}

export const SceneCard: React.FC<SceneCardProps> = ({ 
  node, 
  isActive, 
  isPast,
  onChoice, 
  onBack,
  seed 
}) => {
  // Generate Image URL (Pollinations)
  const imageUrl = useMemo(() => {
    const encodedPrompt = encodeURIComponent(`${node.imagePrompt} cinematic, atmospheric, high resolution, 8k`);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&seed=${seed}&model=flux`;
  }, [node.imagePrompt, seed]);

  // CSS Transforms for Z-axis effect
  // If active: translateZ(0)
  // If past: translateZ(500px) and fade out (moves "behind" viewer)
  // If future (not rendered here usually, but just in case): translateZ(-500px)
  
  const style: React.CSSProperties = {
    opacity: isActive ? 1 : isPast ? 0 : 0,
    pointerEvents: isActive ? 'auto' : 'none',
    transform: isActive 
      ? 'translate3d(0,0,0) scale(1)' 
      : isPast 
        ? 'translate3d(0, 0, 500px) scale(1.5)' // Moves past camera
        : 'translate3d(0, 0, -500px) scale(0.8)', // Waiting in background
    transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    zIndex: isActive ? 10 : isPast ? 20 : 0
  };

  return (
    <div className="card w-full h-full" style={style}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-black">
        <img 
          src={imageUrl} 
          alt={node.imagePrompt}
          className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-end h-full w-full max-w-lg p-8 pb-16">
        
        {/* Narrative Text */}
        <div className="glass-panel p-6 rounded-2xl mb-6 backdrop-blur-xl border-white/10 transform transition-all duration-700 delay-100 translate-y-0">
          <p className="text-lg md:text-xl leading-relaxed text-shadow-sm font-medium text-gray-100">
            {node.text}
          </p>
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-3">
           {!node.isEnding ? (
             node.choices.map((choice, idx) => (
               <Button 
                 key={idx} 
                 onClick={() => onChoice(choice)}
                 variant="outline"
                 className="w-full text-left justify-start h-auto py-4 px-6 border-white/20 hover:border-white hover:bg-white/10"
               >
                 <span className="mr-2 opacity-50">›</span> {choice.text}
               </Button>
             ))
           ) : (
             <div className="text-center">
               <div className="text-sm uppercase tracking-widest text-purple-400 mb-4">End of Narrative</div>
               <Button onClick={() => window.location.reload()}>Re-Dream</Button>
             </div>
           )}
           
           {/* Back Button (if not start) */}
           {onBack && (
             <button 
               onClick={onBack}
               className="mt-4 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors py-2"
             >
               Go Back
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
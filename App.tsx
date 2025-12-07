import React, { useState, useEffect, useCallback } from 'react';
import { GameState, StoryGraph, StoryNode, PlayHistoryItem } from './types';
import { generateStory } from './services/geminiService';
import { StartScreen } from './components/StartScreen';
import { SceneCard } from './components/SceneCard';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [storyGraph, setStoryGraph] = useState<StoryGraph | null>(null);
  const [history, setHistory] = useState<PlayHistoryItem[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [seeds, setSeeds] = useState<Record<string, number>>({});

  // Initialize a new game
  const handleStart = async (subject: string) => {
    setGameState(GameState.LOADING);
    setLoadingError(null);
    try {
      const graph = await generateStory(subject);
      setStoryGraph(graph);
      
      // Generate seeds for all nodes upfront for consistency
      const newSeeds: Record<string, number> = {};
      Object.keys(graph.nodes).forEach(id => {
        newSeeds[id] = Math.floor(Math.random() * 999999);
      });
      setSeeds(newSeeds);

      setHistory([{ nodeId: graph.startNodeId }]);
      setGameState(GameState.PLAYING);
    } catch (err: any) {
      console.error(err);
      setLoadingError(err.message || "Failed to generate story.");
      setGameState(GameState.START);
    }
  };

  const currentNodeId = history[history.length - 1]?.nodeId;
  const currentNode = storyGraph?.nodes[currentNodeId];

  // Handle navigation
  const handleChoice = useCallback((choice: { targetId: string }) => {
    if (!storyGraph?.nodes[choice.targetId]) {
        console.error("Target node not found:", choice.targetId);
        return;
    }
    setHistory(prev => [...prev, { nodeId: choice.targetId }]);
  }, [storyGraph]);

  const handleBack = useCallback(() => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    } else {
        // Optional: Go back to start screen if at root?
        if (confirm("Exit current story?")) {
            setGameState(GameState.START);
            setStoryGraph(null);
            setHistory([]);
        }
    }
  }, [history]);

  // Preload next images logic could go here
  useEffect(() => {
      if (currentNode && storyGraph) {
          currentNode.choices.forEach(choice => {
             const nextNode = storyGraph.nodes[choice.targetId];
             if (nextNode) {
                 const encoded = encodeURIComponent(`${nextNode.imagePrompt} cinematic, atmospheric, high resolution, 8k`);
                 const url = `https://image.pollinations.ai/prompt/${encoded}?width=720&height=1280&nologo=true&seed=${seeds[nextNode.id]}&model=flux`;
                 const img = new Image();
                 img.src = url;
             }
          });
      }
  }, [currentNode, storyGraph, seeds]);

  return (
    <div className="viewport bg-black text-white">
      {gameState === GameState.START || gameState === GameState.LOADING ? (
         <>
            <StartScreen onStart={handleStart} isLoading={gameState === GameState.LOADING} />
            {loadingError && (
                <div className="absolute bottom-10 left-0 w-full text-center text-red-400 p-4 z-50 animate-bounce">
                    {loadingError}
                </div>
            )}
         </>
      ) : (
        <div className="world">
           {storyGraph && history.map((item, index) => {
              const node = storyGraph.nodes[item.nodeId];
              // Only render the current one and maybe the immediate previous one for transition effects
              // To save resources, we might limit this, but for the "stack" feel, rendering all is okay if opacity handles visibility.
              // Optimization: Only render last 2 nodes.
              if (index < history.length - 2) return null;

              const isPast = index < history.length - 1;
              const isActive = index === history.length - 1;
              
              return (
                <SceneCard 
                  key={`${item.nodeId}-${index}`}
                  node={node}
                  isActive={isActive}
                  isPast={isPast}
                  onChoice={handleChoice}
                  onBack={history.length > 1 ? handleBack : undefined}
                  seed={seeds[item.nodeId]}
                />
              );
           })}
        </div>
      )}
      
      {/* HUD / Overlay elements */}
      {gameState === GameState.PLAYING && (
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none mix-blend-difference">
              <div className="text-xs font-mono opacity-50">STORY ENGINE // {storyGraph?.title}</div>
              <div className="text-xs font-mono opacity-50">DEPTH: {history.length}</div>
          </div>
      )}
    </div>
  );
};

export default App;
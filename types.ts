export interface StoryChoice {
  text: string;
  targetId: string;
}

export interface StoryNode {
  id: string;
  text: string;
  imagePrompt: string;
  choices: StoryChoice[];
  isEnding?: boolean;
}

export interface StoryGraph {
  title: string;
  nodes: Record<string, StoryNode>;
  startNodeId: string;
}

export enum GameState {
  START,
  LOADING,
  PLAYING,
  ERROR
}

export interface PlayHistoryItem {
  nodeId: string;
  selectedChoiceIndex?: number;
}
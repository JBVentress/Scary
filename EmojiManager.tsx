import { useState, useEffect } from 'react';
import EmojiEffect from './EmojiEffect';

interface EmojiInfo {
  id: number;
  emoji: string;
  position: { x: number; y: number };
}

// Create a singleton manager for emoji animations
// This allows any component to show emojis without prop drilling
const managers: { [key: string]: ((emoji: string, position: { x: number; y: number }) => void) } = {};

export function getEmojiManager(id: string = 'default') {
  return {
    showEmoji: (emoji: string, position: { x: number; y: number }) => {
      if (managers[id]) {
        managers[id](emoji, position);
      }
    }
  };
}

export default function EmojiManager({ id = 'default' }: { id?: string }) {
  const [emojiEffects, setEmojiEffects] = useState<EmojiInfo[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Register this component as the manager
    managers[id] = (emoji: string, position: { x: number; y: number }) => {
      const newEmoji: EmojiInfo = {
        id: counter,
        emoji,
        position
      };
      
      setEmojiEffects(prev => [...prev, newEmoji]);
      setCounter(prev => prev + 1);
    };
    
    return () => {
      // Clean up when unmounted
      delete managers[id];
    };
  }, [id, counter]);

  const removeEmoji = (id: number) => {
    setEmojiEffects(prev => prev.filter(e => e.id !== id));
  };

  return (
    <>
      {emojiEffects.map(effect => (
        <EmojiEffect
          key={effect.id}
          emoji={effect.emoji}
          position={effect.position}
          onComplete={() => removeEmoji(effect.id)}
        />
      ))}
    </>
  );
}
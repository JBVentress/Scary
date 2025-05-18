import { create } from 'zustand';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  multiplier: number;
  intensityLevel: number;
  count: number;
  maxCount: number;
  autoClickIncrement: number;
  costScale: number;
  icon: string;
  category: 'basic' | 'sex_toy' | 'high_tech' | 'special' | 'legendary';
}

interface LovePointsState {
  points: number;
  multiplier: number;
  totalPoints: number;
  clicksPerPoint: number;
  autoClicksPerSecond: number;
  upgradesPurchased: number;
  
  // Available upgrades
  upgrades: Upgrade[];
  
  // Actions
  addPoints: (amount: number) => void;
  purchaseUpgrade: (id: string) => boolean;
  getUpgrade: (id: string) => Upgrade | undefined;
  calculateUpgradeCost: (upgrade: Upgrade) => number;
  resetState: () => void;
}

// Define upgrades with increasing intensity levels
const initialUpgrades: Upgrade[] = [
  // Basic upgrades (Level 1) - Now more expensive
  {
    id: 'finger',
    name: 'Finger',
    description: 'A basic way to get started.',
    baseCost: 100000000000, // Higher base cost
    multiplier: 1.5, // Base multiplier
    intensityLevel: 1,
    count: 0,
    maxCount: 5,
    autoClickIncrement: 0,
    costScale: 2.5, // Steeper cost scaling
    icon: '👆',
    category: 'basic'
  },
  {
    id: 'two_fingers',
    name: 'Two Fingers',
    description: 'Double the pleasure with two fingers.',
    baseCost: 3000000, // Tripled
    multiplier: 1.25,
    intensityLevel: 1,
    count: 0,
    maxCount: 5,
    autoClickIncrement: 0.1,
    costScale: 2.5, // Steeper cost scaling
    icon: '✌️',
    category: 'basic'
  },
  {
    id: 'three_fingers',
    name: 'Three Fingers',
    description: 'Triple the pleasure with three fingers.',
    baseCost: 1050, // Tripled
    multiplier: 1.3,
    intensityLevel: 1, 
    count: 0,
    maxCount: 4,
    autoClickIncrement: 0.15,
    costScale: 2.5, // Steeper cost scaling
    icon: '🖖',
    category: 'basic'
  },
  {
    id: 'massage',
    name: 'Massage',
    description: 'Gentle touches that slowly build pleasure.',
    baseCost: 400, // Increased from 100
    multiplier: 1.3,
    intensityLevel: 1,
    count: 0,
    maxCount: 3,
    autoClickIncrement: 0.3,
    costScale: 2.6, // Steeper cost scaling
    icon: '✋',
    category: 'basic'
  },
  {
    id: 'lube',
    name: 'Lubricant',
    description: 'Makes everything feel smoother and more intense.',
    baseCost: 500, // Increased from 200
    multiplier: 1.4,
    intensityLevel: 1,
    count: 0,
    maxCount: 3,
    autoClickIncrement: 0.2,
    costScale: 2.5, // Steeper cost scaling
    icon: '💧',
    category: 'basic'
  },
  {
    id: 'blindfold',
    name: 'Blindfold',
    description: 'Heightens other sensations by removing visual distractions.',
    baseCost: 600, // Increased from 300
    multiplier: 1.5,
    intensityLevel: 1,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 0.5,
    costScale: 2.5, // Steeper cost scaling
    icon: '🕶️',
    category: 'basic'
  },
  {
    id: 'ice_cube',
    name: 'Ice Cube',
    description: 'Adds a shock of temperature for heightened sensitivity.',
    baseCost: 700, // Increased from 350
    multiplier: 1.45,
    intensityLevel: 1,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 0.4,
    costScale: 2.5, // Steeper cost scaling
    icon: '🧊',
    category: 'basic'
  },
  {
    id: 'feather',
    name: 'Feather',
    description: 'Tickling builds up anticipation and nerve sensitivity.',
    baseCost: 800, // Increased from 375
    multiplier: 1.4,
    intensityLevel: 1,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 0.3,
    costScale: 2.5, // Steeper cost scaling
    icon: '🪶',
    category: 'basic'
  },
  {
    id: 'hot_oil',
    name: 'Hot Oil',
    description: 'Relaxes muscles and enhances touch sensations.',
    baseCost: 900, // Increased from 380
    multiplier: 1.42,
    intensityLevel: 1,
    count: 0,
    maxCount: 3,
    autoClickIncrement: 0.35,
    costScale: 2.5, // Steeper cost scaling
    icon: '🧴',
    category: 'basic'
  },
  {
    id: 'scented_candles',
    name: 'Scented Candles',
    description: 'Creates a sensual atmosphere to enhance pleasure.',
    baseCost: 2500, // Much more expensive
    multiplier: 2.0, // More powerful
    intensityLevel: 1,
    count: 0,
    maxCount: 3,
    autoClickIncrement: 0.5, // Better auto-clicking
    costScale: 3.5, // Much steeper cost scaling
    icon: '🕯️',
    category: 'basic'
  },
  {
    id: 'silk_sheets',
    name: 'Silk Sheets',
    description: 'Smooth texture against the skin enhances every touch.',
    baseCost: 1000, // Increased from 395
    multiplier: 1.43,
    intensityLevel: 1,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 0.32,
    costScale: 2.5, // Steeper cost scaling
    icon: '🛏️',
    category: 'basic'
  },
  
  // Sex toys (Level 2-3)
  {
    id: 'vibrator',
    name: 'Vibrator',
    description: 'Adds automatic clicks over time.',
    baseCost: 1500, // Increased from 400
    multiplier: 1.6,
    intensityLevel: 2,
    count: 0,
    maxCount: 4,
    autoClickIncrement: 1.5,
    costScale: 3.0, // Steeper cost scaling
    icon: '📳',
    category: 'sex_toy'
  },
  {
    id: 'dildo',
    name: 'Dildo',
    description: 'Increases pleasure multiplier significantly.',
    baseCost: 2000, // Increased from 600
    multiplier: 1.8,
    intensityLevel: 2,
    count: 0,
    maxCount: 3,
    autoClickIncrement: 0.7,
    costScale: 3.2, // Steeper cost scaling
    icon: '🍆',
    category: 'sex_toy'
  },
  {
    id: 'buttplug',
    name: 'Buttplug',
    description: 'Enhances other toys effectiveness.',
    baseCost: 2500, // Increased from 750
    multiplier: 1.7,
    intensityLevel: 3,
    count: 0,
    maxCount: 3,
    autoClickIncrement: 1.0,
    costScale: 3.2, // Steeper cost scaling
    icon: '🔌',
    category: 'sex_toy'
  },
  {
    id: 'nipple_clamps',
    name: 'Nipple Clamps',
    description: 'Increases sensitivity and pleasure intensity.',
    baseCost: 2000,
    multiplier: 1.9,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 1.2,
    costScale: 2.6,
    icon: '🔗',
    category: 'sex_toy'
  },
  {
    id: 'machine',
    name: 'Machine',
    description: 'Significantly increases points and automatic clicks.',
    baseCost: 3000,
    multiplier: 2.2,
    intensityLevel: 3,
    count: 0,
    maxCount: 3,
    autoClickIncrement: 3.5,
    costScale: 3.0,
    icon: '⚙️',
    category: 'sex_toy'
  },
  {
    id: 'magic_wand',
    name: 'Magic Wand',
    description: 'The legendary massager that never disappoints.',
    baseCost: 3500,
    multiplier: 2.4,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 4.0,
    costScale: 3.0,
    icon: '🪄',
    category: 'sex_toy'
  },
  {
    id: 'dual_stimulator',
    name: 'Dual Stimulator',
    description: 'Simultaneously stimulates multiple sensitive spots.',
    baseCost: 4000,
    multiplier: 2.6,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 4.2,
    costScale: 3.1,
    icon: '🍑',
    category: 'sex_toy'
  },
  {
    id: 'heated_toy',
    name: 'Heated Toy',
    description: 'Warms up to body temperature for a more realistic sensation.',
    baseCost: 4200,
    multiplier: 2.45,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 3.8,
    costScale: 3.0,
    icon: '🔥',
    category: 'sex_toy'
  },
  {
    id: 'rabbit_toy',
    name: 'Rabbit Toy',
    description: 'Iconic toy design with multiple stimulation points.',
    baseCost: 4300,
    multiplier: 2.5,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 4.0,
    costScale: 3.1,
    icon: '🐰',
    category: 'sex_toy'
  },
  {
    id: 'glass_toy',
    name: 'Glass Toy',
    description: 'Temperature-responsive with a smooth, frictionless surface.',
    baseCost: 4400,
    multiplier: 2.55,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 3.0,
    costScale: 2.9,
    icon: '💎',
    category: 'sex_toy'
  },
  {
    id: 'suction_toy',
    name: 'Suction Toy',
    description: 'Creates a pleasurable suction effect without direct contact.',
    baseCost: 4500,
    multiplier: 2.7,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 4.1,
    costScale: 3.2,
    icon: '🌪️',
    category: 'sex_toy'
  },
  {
    id: 'anal_beads',
    name: 'Anal Beads',
    description: 'Gradually increasing sized beads for enhanced stimulation.',
    baseCost: 4600,
    multiplier: 2.65,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 3.9,
    costScale: 3.1,
    icon: '🔮',
    category: 'sex_toy'
  },
  {
    id: 'thrusting_toy',
    name: 'Thrusting Toy',
    description: 'Automatic thrusting motion for hands-free pleasure.',
    baseCost: 4700,
    multiplier: 2.75,
    intensityLevel: 3,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 4.3,
    costScale: 3.2,
    icon: '⬆️',
    category: 'sex_toy'
  },
  
  // High-tech (Level 4)
  {
    id: 'remote_control',
    name: 'Remote Control',
    description: 'Control multiple toys at once with precision.',
    baseCost: 5000,
    multiplier: 2.3,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 2.5,
    costScale: 3.0,
    icon: '🎮',
    category: 'high_tech'
  },
  {
    id: 'tentacle',
    name: 'Tentacle',
    description: 'Multiple points of stimulation at once.',
    baseCost: 7500,
    multiplier: 2.7,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 4.5,
    costScale: 3.5,
    icon: '🦑',
    category: 'high_tech'
  },
  {
    id: 'smart_toys',
    name: 'Smart Toys',
    description: 'Adapts to her needs and responds automatically.',
    baseCost: 10000,
    multiplier: 2.8,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 5,
    costScale: 3.8,
    icon: '📱',
    category: 'high_tech'
  },
  {
    id: 'virtual_reality',
    name: 'Virtual Reality',
    description: 'An immersive experience that boosts all gains.',
    baseCost: 15000,
    multiplier: 3.2,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 6,
    costScale: 4.0,
    icon: '🥽',
    category: 'high_tech'
  },
  {
    id: 'pulse_wave',
    name: 'Pulse Wave',
    description: 'Uses sonic waves to create pleasure without direct contact.',
    baseCost: 17500,
    multiplier: 3.4,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 7,
    costScale: 4.1,
    icon: '〰️',
    category: 'high_tech'
  },
  {
    id: 'pleasure_bot',
    name: 'Pleasure Bot',
    description: 'Robotic assistant that helps apply and manage all other toys.',
    baseCost: 20000,
    multiplier: 3.8,
    intensityLevel: 4,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 8,
    costScale: 4.3,
    icon: '🤖',
    category: 'high_tech'
  },
  {
    id: 'haptic_suit',
    name: 'Haptic Suit',
    description: 'Full-body suit that translates digital sensations into physical stimulation.',
    baseCost: 20500,
    multiplier: 3.6,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 7.5,
    costScale: 4.2,
    icon: '👔',
    category: 'high_tech'
  },
  {
    id: 'holographic_partner',
    name: 'Holographic Partner',
    description: 'Interactive hologram that responds to voice commands and physical touches.',
    baseCost: 21000,
    multiplier: 3.7,
    intensityLevel: 4,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 8.5,
    costScale: 0,
    icon: '👤',
    category: 'high_tech'
  },
  {
    id: 'biofeedback_system',
    name: 'Biofeedback System',
    description: 'Monitors physiological responses and adjusts stimulation in real-time.',
    baseCost: 21500,
    multiplier: 3.9,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 7.8,
    costScale: 4.3,
    icon: '📊',
    category: 'high_tech'
  },
  {
    id: 'electrostim',
    name: 'Electrostimulation',
    description: 'Precisely controlled electrical impulses for unique sensations.',
    baseCost: 22000,
    multiplier: 4.0,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 8.2,
    costScale: 4.4,
    icon: '⚡',
    category: 'high_tech'
  },
  {
    id: 'climate_control',
    name: 'Climate Control',
    description: 'Creates rapid temperature changes for intense sensory experiences.',
    baseCost: 22500,
    multiplier: 3.5,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 7.2,
    costScale: 4.0,
    icon: '🌡️',
    category: 'high_tech'
  },
  {
    id: 'nano_stimulators',
    name: 'Nano Stimulators',
    description: 'Microscopic robots that provide precise stimulation at the cellular level.',
    baseCost: 23000,
    multiplier: 4.1,
    intensityLevel: 4,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 8.7,
    costScale: 4.5,
    icon: '🔬',
    category: 'high_tech'
  },
  
  // Special (Level 5)
  {
    id: 'sybian',
    name: 'Sybian',
    description: 'Extreme pleasure machine with multiple functions.',
    baseCost: 25000,
    multiplier: 4.2,
    intensityLevel: 5,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 9,
    costScale: 4.5,
    icon: '🎯',
    category: 'special'
  },
  {
    id: 'pleasure_chamber',
    name: 'Pleasure Chamber',
    description: 'A full-body stimulation environment with multiple devices.',
    baseCost: 35000,
    multiplier: 4.5,
    intensityLevel: 5,
    count: 0,
    maxCount: 2,
    autoClickIncrement: 12,
    costScale: 5.0,
    icon: '🏮',
    category: 'special'
  },
  {
    id: 'neural_interface',
    name: 'Neural Interface',
    description: 'Connects directly to pleasure centers in the brain.',
    baseCost: 50000,
    multiplier: 4.8,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 15,
    costScale: 5.5,
    icon: '🧠',
    category: 'special'
  },
  {
    id: 'ai_assistant',
    name: 'AI Sex Assistant',
    description: 'Advanced technology that learns and perfectly stimulates all pleasure points.',
    baseCost: 75000,
    multiplier: 5.5,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 20,
    costScale: 0, // Can only be purchased once
    icon: '🤖',
    category: 'special'
  },
  {
    id: 'mindlink',
    name: 'Mind Link',
    description: 'Creates a psychic connection for perfect synchronization of pleasure.',
    baseCost: 90000,
    multiplier: 6.5,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 22,
    costScale: 0, // Can only be purchased once
    icon: '✨',
    category: 'special'
  },
  {
    id: 'quantum_pleasure',
    name: 'Quantum Pleasure',
    description: 'Utilizes quantum technology to stimulate all possible pleasure points simultaneously across dimensions.',
    baseCost: 120000,
    multiplier: 8.0,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 30,
    costScale: 0, // Can only be purchased once
    icon: '⚛️',
    category: 'special'
  },
  {
    id: 'pleasure_enhancer',
    name: 'Pleasure Enhancer',
    description: 'Molecular-level enhancement of natural pleasure responses.',
    baseCost: 125000,
    multiplier: 7.5,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 28,
    costScale: 0,
    icon: '💊',
    category: 'special'
  },
  {
    id: 'dream_weaver',
    name: 'Dream Weaver',
    description: 'Creates personalized pleasure scenarios from deepest fantasies.',
    baseCost: 130000,
    multiplier: 7.8,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 32,
    costScale: 0,
    icon: '💭',
    category: 'special'
  },
  {
    id: 'ecstasy_field',
    name: 'Ecstasy Field',
    description: 'Creates an energy field that heightens all sensations to superhuman levels.',
    baseCost: 135000,
    multiplier: 8.2,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 35,
    costScale: 0,
    icon: '⚡',
    category: 'special'
  },
  {
    id: 'time_dilation',
    name: 'Time Dilation',
    description: 'Stretches moments of pleasure to feel like hours of ecstasy.',
    baseCost: 140000,
    multiplier: 8.5,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 40,
    costScale: 0,
    icon: '⏱️',
    category: 'special'
  },
  {
    id: 'bliss_matrix',
    name: 'Bliss Matrix',
    description: 'A network of nano-sensors that map and stimulate the entire nervous system.',
    baseCost: 145000,
    multiplier: 9.0,
    intensityLevel: 5,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 45,
    costScale: 0,
    icon: '🔄',
    category: 'special'
  },
  
  // Legendary (Level 6) - High-end category but more affordable
  {
    id: 'pleasure_goddess',
    name: 'Pleasure Goddess',
    description: 'Transcends physical limits and provides godlike pleasure.',
    baseCost: 75000000, // Extremely hard to get
    multiplier: 50.0, // Much more powerful
    intensityLevel: 6,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 100, // More auto-clicks
    costScale: 0, // Can only be purchased once
    icon: '👑',
    category: 'legendary'
  },
  {
    id: 'cosmic_bliss',
    name: 'Cosmic Bliss',
    description: 'Channels the energy of the universe to create transcendent ecstasy beyond mortal comprehension.',
    baseCost: 250000,
    multiplier: 15.0,
    intensityLevel: 6,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 75,
    costScale: 0, // Can only be purchased once
    icon: '🌌',
    category: 'legendary'
  },
  {
    id: 'infinity_orgasm',
    name: 'Infinity Orgasm',
    description: 'The ultimate pleasure experience that creates a continuous state of perfect bliss for all eternity.',
    baseCost: 500000,
    multiplier: 25.0,
    intensityLevel: 6,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 100,
    costScale: 0, // Can only be purchased once
    icon: '♾️',
    category: 'legendary'
  },
  {
    id: 'transcendence',
    name: 'Transcendence',
    description: 'Evolves beyond physical form to experience pleasure as pure energy.',
    baseCost: 750000,
    multiplier: 30.0,
    intensityLevel: 6,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 150,
    costScale: 0,
    icon: '✴️',
    category: 'legendary'
  },
  {
    id: 'unified_field',
    name: 'Unified Pleasure Field',
    description: 'Unites all forms of pleasure into a single, overwhelming experience.',
    baseCost: 1000000,
    multiplier: 50.0,
    intensityLevel: 6,
    count: 0,
    maxCount: 1,
    autoClickIncrement: 200,
    costScale: 0,
    icon: '🌈',
    category: 'legendary'
  }
];

export const useLovePoints = create<LovePointsState>((set, get) => ({
  points: 0,
  multiplier: 1.0,
  totalPoints: 0,
  clicksPerPoint: 1,
  autoClicksPerSecond: 0,
  upgradesPurchased: 0,
  
  upgrades: initialUpgrades,
  
  addPoints: (amount) => {
    const { multiplier } = get();
    // Regular amount (no artificial multiplier)
    const pointsToAdd = amount * multiplier;
    
    set(state => ({ 
      points: state.points + pointsToAdd,
      totalPoints: state.totalPoints + pointsToAdd
    }));
  },
  
  calculateUpgradeCost: (upgrade: Upgrade) => {
    // If maxCount is 1 or we've reached max, use base cost
    if (upgrade.maxCount === 1 || upgrade.count >= upgrade.maxCount) {
      return upgrade.baseCost;
    }
    
    // Calculate scaled cost based on how many have been purchased
    return Math.round(upgrade.baseCost * Math.pow(upgrade.costScale, upgrade.count));
  },
  
  purchaseUpgrade: (id) => {
    const { points, upgrades, calculateUpgradeCost } = get();
    const upgradeIndex = upgrades.findIndex(u => u.id === id);
    
    if (upgradeIndex === -1) return false;
    
    const upgrade = upgrades[upgradeIndex];
    
    // Check if already at max count or not enough points
    if (upgrade.count >= upgrade.maxCount) return false;
    
    const currentCost = calculateUpgradeCost(upgrade);
    if (points < currentCost) return false;
    
    // Create a new array with the updated upgrade
    const newUpgrades = [...upgrades];
    newUpgrades[upgradeIndex] = {
      ...upgrade,
      count: upgrade.count + 1
    };
    
    // Apply upgrade effects
    let autoClicksPerSecond = get().autoClicksPerSecond;
    let newMultiplier = get().multiplier;
    
    // Add auto clicks from this upgrade
    autoClicksPerSecond += upgrade.autoClickIncrement;
    
    // Apply multiplier based on whether it's first purchase or additional
    if (upgrade.count === 0) {
      // First purchase gets full multiplier
      newMultiplier *= upgrade.multiplier;
    } else {
      // Additional purchases get diminishing returns
      newMultiplier *= (1 + (upgrade.multiplier - 1) * 0.5);
    }
    
    // Update state
    set(state => ({
      points: state.points - currentCost,
      upgrades: newUpgrades,
      multiplier: newMultiplier,
      autoClicksPerSecond,
      upgradesPurchased: state.upgradesPurchased + 1
    }));
    
    return true;
  },
  
  getUpgrade: (id) => {
    return get().upgrades.find(u => u.id === id);
  },
  
  resetState: () => {
    set({
      points: 0,
      multiplier: 1.0,
      clicksPerPoint: 1,
      autoClicksPerSecond: 0,
      upgradesPurchased: 0,
      upgrades: initialUpgrades,
      totalPoints: 0
    });
  }
}));
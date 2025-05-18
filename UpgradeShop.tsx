import { useState, useRef } from 'react';
import { useLovePoints } from '@/lib/stores/useLovePoints';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getEmojiManager } from './EmojiManager';

export default function UpgradeShop() {
  const { 
    points, 
    multiplier, 
    totalPoints, 
    upgradesPurchased, 
    upgrades, 
    purchaseUpgrade,
    calculateUpgradeCost,
    autoClicksPerSecond
  } = useLovePoints();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const shopRef = useRef<HTMLDivElement>(null);
  const emojiManager = getEmojiManager();
  
  // Filter upgrades by category and sort by intensity level
  const filteredUpgrades = upgrades
    .filter(upgrade => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'purchased' && upgrade.count > 0) return true;
      if (selectedCategory === 'available' && upgrade.count < upgrade.maxCount) return true;
      if (selectedCategory === selectedCategory && upgrade.category === selectedCategory) return true;
      return false;
    })
    .sort((a, b) => {
      // First sort by intensity level
      if (a.intensityLevel !== b.intensityLevel) {
        return a.intensityLevel - b.intensityLevel;
      }
      // Then by whether they can be purchased (purchasable first)
      const aCost = calculateUpgradeCost(a);
      const bCost = calculateUpgradeCost(b);
      const aCanBuy = a.count < a.maxCount && points >= aCost;
      const bCanBuy = b.count < b.maxCount && points >= bCost;
      
      if (aCanBuy !== bCanBuy) {
        return aCanBuy ? -1 : 1;
      }
      
      // Then by cost
      return aCost - bCost;
    });
  
  // Group upgrades by intensity level for better display
  const groupedUpgrades: Record<number, typeof upgrades> = {};
  filteredUpgrades.forEach(upgrade => {
    if (!groupedUpgrades[upgrade.intensityLevel]) {
      groupedUpgrades[upgrade.intensityLevel] = [];
    }
    groupedUpgrades[upgrade.intensityLevel].push(upgrade);
  });
  
  // Level names for headers
  const levelNames = {
    1: "Basic Pleasure",
    2: "Enhanced Pleasure",
    3: "Advanced Toys",
    4: "High-Tech Experience",
    5: "Ultimate Ecstasy",
    6: "Legendary Experience"
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md max-h-[600px] overflow-y-auto">
      <div className="flex flex-col">
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2">
          <h2 className="text-xl font-bold text-pink-600">Pleasure Shop</h2>
          <Badge className="bg-pink-600 text-md py-1 px-3">{Math.floor(points)} LP</Badge>
        </div>
        
        <div className="flex justify-between items-center mb-2 text-sm bg-pink-50 p-2 rounded-lg">
          <div>
            <span className="text-gray-600">Multiplier:</span>
            <span className="ml-1 font-semibold text-purple-600">x{multiplier.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-gray-600">Auto:</span>
            <span className="ml-1 font-semibold text-purple-600">{autoClicksPerSecond.toFixed(1)}/sec</span>
          </div>
          <div>
            <span className="text-gray-600">Bought:</span>
            <span className="ml-1 font-semibold text-purple-600">{upgradesPurchased}</span>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Button 
            size="sm" 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="flex-1"
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'available' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('available')}
            className="flex-1"
          >
            Available
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'purchased' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('purchased')}
            className="flex-1"
          >
            Purchased
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'basic' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('basic')}
            className="flex-1"
          >
            Basic
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'sex_toy' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('sex_toy')}
            className="flex-1"
          >
            Sex Toys
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'high_tech' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('high_tech')}
            className="flex-1"
          >
            High-Tech
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'special' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('special')}
            className="flex-1"
          >
            Special
          </Button>
          <Button 
            size="sm" 
            variant={selectedCategory === 'legendary' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('legendary')}
            className="flex-1"
          >
            Legendary
          </Button>
        </div>
        
        {/* Upgrade list grouped by intensity */}
        <div className="space-y-4">
          {Object.keys(groupedUpgrades).map((level) => {
            const intLevel = parseInt(level);
            return (
              <div key={`level-${level}`} className="mb-2">
                <div className="text-sm font-bold text-pink-700 mb-2 border-b border-pink-200 pb-1">
                  Level {level}: {levelNames[intLevel as keyof typeof levelNames] || 'Upgrades'}
                </div>
                
                <div className="space-y-2">
                  {groupedUpgrades[intLevel].map((upgrade) => {
                    const upgradeCost = calculateUpgradeCost(upgrade);
                    const canBuy = points >= upgradeCost && upgrade.count < upgrade.maxCount;
                    return (
                      <div 
                        key={upgrade.id}
                        className={`p-3 rounded-lg border relative transition-all ${
                          upgrade.count >= upgrade.maxCount 
                            ? 'bg-purple-50 border-purple-200' 
                            : canBuy
                              ? 'bg-white border-pink-300 hover:bg-pink-50 cursor-pointer' 
                              : 'bg-gray-50 border-gray-200 opacity-80'
                        }`}
                        onClick={(e) => {
                          if (canBuy) {
                            const success = purchaseUpgrade(upgrade.id);
                            if (success) {
                              // Trigger emoji animation near character
                              // Calculate position relative to screen
                              const rect = e.currentTarget.getBoundingClientRect();
                              const position = {
                                x: window.innerWidth * 0.5, // Center of the screen (where character is)
                                y: window.innerHeight * 0.4 // Near character face
                              };
                              
                              // Show the emoji
                              emojiManager.showEmoji(upgrade.icon, position);
                            }
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{upgrade.icon}</div>
                            <div>
                              <div className="font-medium text-pink-800">
                                {upgrade.name}
                                {upgrade.count > 0 && (
                                  <span className="text-xs ml-1 text-pink-500">
                                    x{upgrade.count}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">{upgrade.description}</div>
                              {upgrade.count > 0 && (
                                <div className="text-xs text-green-600 mt-1">
                                  {upgrade.autoClickIncrement > 0 && (
                                    <span className="mr-2">+{upgrade.autoClickIncrement * upgrade.count} auto/sec</span>
                                  )}
                                  <span>x{upgrade.multiplier.toFixed(1)} multiplier</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            {upgrade.count >= upgrade.maxCount ? (
                              <Badge className="bg-purple-600">MAX</Badge>
                            ) : (
                              <Badge className={canBuy ? 'bg-pink-600' : 'bg-gray-400'}>
                                {upgradeCost} LP
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress toward max purchases */}
                        {upgrade.maxCount > 1 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span>Owned: {upgrade.count}/{upgrade.maxCount}</span>
                              <span>Intensity: {upgrade.intensityLevel}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
                                style={{ width: `${(upgrade.count / upgrade.maxCount) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {Object.keys(groupedUpgrades).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No upgrades in this category
            </div>
          )}
        </div>
        

      </div>
    </div>
  );
}
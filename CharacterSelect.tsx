import React from 'react';
import { Button } from '../ui/button';

interface CharacterSelectProps {
  onSelect: (skinType: 'white' | 'mexican' | 'black') => void;
}

export default function CharacterSelect({ onSelect }: CharacterSelectProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
            Choose Your Character
          </h2>
          
          <div className="space-y-4">
            <div 
              className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all cursor-pointer"
              onClick={() => onSelect('white')}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-[#f5e1da] border-4 border-pink-300 flex items-center justify-center text-2xl">
                  👱‍♀️
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-pink-800">White Girl</h3>
                  <p className="text-sm text-gray-600">Fair skin with pink undertones</p>
                </div>
              </div>
              <Button className="w-full mt-3 bg-pink-500 hover:bg-pink-600">
                Select
              </Button>
            </div>
            
            <div 
              className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 transition-all cursor-pointer"
              onClick={() => onSelect('mexican')}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-[#d4a675] border-4 border-amber-300 flex items-center justify-center text-2xl">
                  💃
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-amber-800">Mexican Girl</h3>
                  <p className="text-sm text-gray-600">Warm olive complexion</p>
                </div>
              </div>
              <Button className="w-full mt-3 bg-amber-500 hover:bg-amber-600">
                Select
              </Button>
            </div>
            
            <div 
              className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer"
              onClick={() => onSelect('black')}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-[#5c3c2e] border-4 border-purple-300 flex items-center justify-center text-2xl">
                  👸🏿
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-purple-800">Black Girl</h3>
                  <p className="text-sm text-gray-600">Rich deep skin tones</p>
                </div>
              </div>
              <Button className="w-full mt-3 bg-purple-500 hover:bg-purple-600">
                Select
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
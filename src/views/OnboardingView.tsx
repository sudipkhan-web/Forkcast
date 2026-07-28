import React, { useState, useContext } from 'react';
import { Sparkles, Plus, Check, ArrowRight, ChefHat } from 'lucide-react';
import { PersonProfile, InventoryItem } from '../types';
import { AppContext } from '../context/AppContext';
import { estimateExpirationDate } from '../utils/expiration';

interface OnboardingViewProps {
  household: PersonProfile[];
  updateHouseholdMember: (person: PersonProfile) => void;
  setEditingPersonId: (id: string) => void;
  setActiveTab: (tab: any) => void;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  onContinue: () => void;
}

const COMMON_PANTRY_ITEMS = [
  'Eggs', 'Milk', 'Butter', 'Pasta', 'Rice', 'Garlic', 
  'Onion', 'Olive Oil', 'Chicken', 'Tomatoes', 'Cheese', 'Bread'
];

export function OnboardingView({
  household,
  updateHouseholdMember,
  setEditingPersonId,
  setActiveTab,
  inventory,
  setInventory,
  onContinue
}: OnboardingViewProps) {
  const { customIngredientRules } = useContext(AppContext)!;
  const [step, setStep] = useState(1);
  const [addedItemsCount, setAddedItemsCount] = useState(0);

  const handleTogglePantryItem = (item: string) => {
    const existing = inventory.find(i => i.name.toLowerCase() === item.toLowerCase());
    if (existing) {
      setInventory(prev => prev.filter(i => i.id !== existing.id));
      setAddedItemsCount(prev => Math.max(0, prev - 1));
    } else {
      const normalizedName = item.toLowerCase();
      const rule = customIngredientRules?.[normalizedName] || { location: 'pantry', category: 'Other' };
      setInventory(prev => [{ 
        id: Date.now().toString() + Math.random(), 
        name: item, 
        quantity: 1, 
        location: rule.location, 
        category: rule.category,
        expiresAt: estimateExpirationDate(rule.category, rule.location)
      }, ...prev]);
      setAddedItemsCount(prev => prev + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#17181C] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {step === 1 && (
          <>
            <div className="text-center mt-8">
              <div className="w-16 h-16 bg-emerald-100 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-3">Welcome to Forkcast</h1>
              <p className="text-stone-500 text-base leading-relaxed max-w-[280px] mx-auto">
                Your personal food decision assistant — less waste, less thinking, better meals.
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Add Household Members</h2>
              {household.map(person => (
                <div key={person.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-white">{person.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {person.dietary.length > 0 ? person.dietary.join(', ') : 'No dietary restrictions'}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingPersonId(person.id);
                      setActiveTab('profile');
                    }}
                    className="text-sm font-medium text-stone-400 hover:text-white px-4 py-2 bg-stone-900 border border-stone-800 hover:bg-stone-800 rounded-xl transition-all active:scale-[0.98]"
                  >
                    Edit
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  const newId = Date.now().toString();
                  const newMember: PersonProfile = { id: newId, name: 'New Member', dietary: [], dislikedIngredients: [], favoriteCuisines: [] };
                  updateHouseholdMember(newMember);
                  setEditingPersonId(newId);
                  setActiveTab('profile');
                }}
                className="w-full py-4 border-2 border-dashed border-stone-800 text-stone-500 rounded-2xl font-medium hover:bg-stone-900 hover:text-stone-300 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Member
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mt-8">
              <div className="w-16 h-16 bg-emerald-100 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">Pantry Quick-Start</h1>
              <p className="text-stone-500 text-sm">Tap the items you already have at home to jumpstart your inventory.</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-8">
              {COMMON_PANTRY_ITEMS.map(item => {
                const isSelected = inventory.some(i => i.name.toLowerCase() === item.toLowerCase());
                return (
                  <button
                    key={item}
                    onClick={() => handleTogglePantryItem(item)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 flex items-center gap-2 border ${
                      isSelected 
                        ? 'bg-[#FC5200] border-[#FC5200] text-white shadow-md shadow-[#FC5200]/20' 
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center h-full text-center mt-12">
            <div className="w-20 h-20 bg-emerald-100 text-[#FC5200] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-4">You're all set!</h1>
            <p className="text-stone-500 text-base max-w-[250px] mx-auto">
              We've added <span className="font-bold text-white">{addedItemsCount} items</span> to your pantry. You're ready to start getting personalized recipe recommendations.
            </p>
          </div>
        )}
      </div>

      <div className="p-6 bg-stone-900 border-t border-stone-800">
        {step === 1 && (
          <>
            <button
              onClick={() => setStep(2)}
              disabled={household.length === 0}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
                household.length > 0 
                  ? 'bg-[#FC5200] text-white hover:bg-[#FC5200] shadow-[#FC5200]/20' 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
            {household.length === 0 && (
              <p className="text-center text-xs text-stone-500 mt-3">Please add at least one member to continue.</p>
            )}
          </>
        )}
        
        {step === 2 && (
          <button
            onClick={() => setStep(3)}
            className="w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] shadow-lg bg-[#FC5200] text-white hover:bg-[#FC5200] shadow-[#FC5200]/20 flex items-center justify-center gap-2"
          >
            Next <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {step === 3 && (
          <button
            onClick={onContinue}
            className="w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] shadow-lg bg-[#FC5200] text-white hover:bg-[#FC5200] shadow-[#FC5200]/20 flex items-center justify-center gap-2"
          >
            Let's Cook!
          </button>
        )}
      </div>
    </div>
  );
}

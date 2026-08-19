import React from 'react';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';
import { motion } from 'motion/react';
import { Flame, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getProgressStats, getFuelingPerformanceCorrelation } from '../utils/progressUtils';
import { getPrimaryPerson } from '../utils/mealUtils';

interface ProgressViewProps {
  setActiveTab: (tab: any) => void;
}

export function ProgressView({ setActiveTab }: ProgressViewProps) {
  const { profile, trainingLogs, household } = useAppContext();
  const primaryPerson = getPrimaryPerson(household);
  
  const { weeklyCoverage, currentStreak, carbTrend, proteinTrend, fatTrend } = getProgressStats(trainingLogs, primaryPerson?.weightKg);
  const [activeMacro, setActiveMacro] = React.useState<'carbs' | 'protein' | 'fat'>('carbs');
  const activeTrend = activeMacro === 'carbs' ? carbTrend : activeMacro === 'protein' ? proteinTrend : fatTrend;
  const correlation = getFuelingPerformanceCorrelation(trainingLogs, primaryPerson?.weightKg);
  
  let daysRemaining: number | null = null;
  if (primaryPerson?.raceDate) {
    const timeDiff = new Date(primaryPerson?.raceDate).getTime() - new Date().getTime();
    daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 overflow-y-auto flex flex-col gap-6 pb-8 bg-[#17181C]"
    >
      <header className="px-6 py-4 flex items-center justify-between bg-[#17181C]/80 backdrop-blur-xl border-b border-stone-800 shrink-0 z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Progress</h1>
      </header>

      <div className="px-6 mt-4 flex flex-col gap-6">
        {/* Race Countdown */}
        {primaryPerson?.raceType && primaryPerson.raceType !== 'Not training for a race' && (
          <>
            {daysRemaining !== null ? (
              <div className={`${CARD} flex flex-col items-center justify-center py-6`}>
                <span className="text-6xl font-mono font-bold text-[#FC5200]">{daysRemaining}</span>
                <span className="text-sm font-display font-bold text-stone-400 uppercase tracking-widest mt-2">Days to Race</span>
                {primaryPerson?.raceType && (
                  <span className="text-xs text-stone-500 mt-1">{primaryPerson?.raceType}</span>
                )}
              </div>
            ) : (
              <div className={`${CARD} flex flex-col items-center justify-center py-10 text-center px-6`}>
                <Target className="w-12 h-12 text-stone-600 mb-4" />
                <h2 className="text-lg font-bold text-white mb-2">No Race Date Set</h2>
                <p className="text-sm text-stone-400 mb-6">Complete your profile to track your countdown and daily fueling goals.</p>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="bg-[#FC5200] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-[#FC5200]/20 hover:bg-orange-600 transition-all active:scale-95"
                >
                  Update Profile
                </button>
              </div>
            )}
          </>
        )}

        {/* Weekly Coverage */}
        <div className={`${CARD} p-6`}>
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">This Week</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-stone-300">Fueled Days</span>
            <span className="text-sm font-mono font-bold text-white">{weeklyCoverage} <span className="text-stone-500">/ 7</span></span>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full ${i < weeklyCoverage ? 'bg-[#FC5200]' : 'bg-stone-800'}`} 
              />
            ))}
          </div>
        </div>

        <div className={`${CARD} p-6`}>
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">Fueling & Performance</h3>
          <p className="text-xs text-stone-400 mb-4">How hitting your carb targets correlates with how strong you feel during training.</p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-stone-800/30 p-3 rounded-lg border border-stone-800">
              <span className="text-sm font-medium text-stone-300">Days you hit carb target:</span>
              <span className="text-sm font-bold text-emerald-400">{correlation.hitCarbTotal > 0 ? `${correlation.hitCarbStrong}/${correlation.hitCarbTotal} Strong` : 'No data'}</span>
            </div>
            <div className="flex justify-between items-center bg-stone-800/30 p-3 rounded-lg border border-stone-800">
              <span className="text-sm font-medium text-stone-300">Days you didn't:</span>
              <span className="text-sm font-bold text-rose-400">{correlation.missCarbTotal > 0 ? `${correlation.missCarbStrong}/${correlation.missCarbTotal} Strong` : 'No data'}</span>
            </div>
          </div>
        </div>


        {/* Streak */}
        <div className={`${CARD} p-6 flex items-center gap-4`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentStreak > 0 ? 'bg-orange-500/10 text-[#FC5200]' : 'bg-stone-800 text-stone-500'}`}>
            <Flame className={`w-7 h-7 ${currentStreak > 0 ? 'fill-[#FC5200]' : ''}`} />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-stone-400 uppercase tracking-wider">Current Streak</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-mono font-bold text-white">{currentStreak}</span>
              <span className="text-sm text-stone-500 font-medium">days</span>
            </div>
          </div>
        </div>\n
        {/* Macro Trend Chart */}
        <div className={`${CARD} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Macro Intake vs Target</h3>
            <span className="text-xs text-stone-500 font-medium">Last 14 days</span>
          </div>
          
          {/* Toggle */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide shrink-0 w-full mb-2">
            {['carbs', 'protein', 'fat'].map(macro => (
              <button
                key={macro}
                onClick={() => setActiveMacro(macro as any)}
                className={activeMacro === macro ? 'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 bg-[#FC5200] border-[#FC5200] text-white shadow-sm' : `${PILL} shrink-0 capitalize`}
              >
                {macro.charAt(0).toUpperCase() + macro.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-1.5 h-48 mt-2 relative">
            {activeTrend.map((day, i) => {
              const maxScale = Math.max(500, ...activeTrend.map((d: any) => Math.max(d.total, d.targetMax)));
              const targetBottom = (day.targetMin / maxScale) * 100;
              const targetHeight = ((day.targetMax - day.targetMin) / maxScale) * 100;
              const barHeight = Math.min((day.total / maxScale) * 100, 100);
              
              const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' });
              
              // Color bar based on target
              let barColor = 'bg-[#FC5200]';
              if (day.total < day.targetMin) barColor = 'bg-stone-500';
              if (day.total > day.targetMax) barColor = 'bg-rose-500';
              if (day.total === 0) barColor = 'bg-stone-800'; // No data
              
              return (
                <div 
                  key={day.date} 
                  className="flex-1 flex flex-col items-center group relative"
                  title={`${day.total}g (Target: ${day.targetMin}-${day.targetMax}g)`}
                >
                  {/* Tooltip on hover/tap */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-stone-800 text-white text-[10px] font-mono px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    {day.total}g
                  </div>
                  
                  {/* Chart Area */}
                  <div className="w-full h-full relative rounded-t-sm overflow-hidden flex items-end justify-center">
                    {/* Target Band */}
                    <div 
                      className="absolute w-full bg-stone-700 rounded-sm z-0"
                      style={{ bottom: `${targetBottom}%`, height: `${targetHeight}%` }}
                    />
                    
                    {/* Actual Bar */}
                    <div 
                      className={`w-full rounded-t-sm relative z-10 transition-all duration-500 ${barColor}`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                  
                  {/* X-axis Label */}
                  <span className="text-[10px] font-medium text-stone-500 mt-2">{dayLabel}</span>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-stone-500" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Under</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#FC5200]" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Over</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-stone-800 border border-stone-700" />
              <span className="text-[10px] text-stone-400 font-medium uppercase">Range</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

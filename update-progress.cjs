const fs = require('fs');
let content = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

const streakDiv = `        {/* Streak */}
        <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 shadow-xl flex items-center gap-4">
          <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center \${currentStreak > 0 ? 'bg-orange-500/10 text-[#FC5200]' : 'bg-stone-800 text-stone-500'}\`}>
            <Flame className={\`w-7 h-7 \${currentStreak > 0 ? 'fill-[#FC5200]' : ''}\`} />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-stone-400 uppercase tracking-wider">Current Streak</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-mono font-bold text-white">{currentStreak}</span>
              <span className="text-sm text-stone-500 font-medium">days</span>
            </div>
          </div>
        </div>`;

const chartDiv = `
        {/* Carb Trend Chart */}
        <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Carb Intake vs Target</h3>
            <span className="text-xs text-stone-500 font-medium">Last 14 days</span>
          </div>
          
          <div className="flex items-end gap-1.5 h-48 mt-4 relative">
            {carbTrend.map((day, i) => {
              const maxScale = Math.max(500, ...carbTrend.map(d => Math.max(d.totalCarbs, d.targetMax)));
              const targetBottom = (day.targetMin / maxScale) * 100;
              const targetHeight = ((day.targetMax - day.targetMin) / maxScale) * 100;
              const barHeight = Math.min((day.totalCarbs / maxScale) * 100, 100);
              
              const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' });
              
              // Color bar based on target
              let barColor = 'bg-[#FC5200]';
              if (day.totalCarbs < day.targetMin) barColor = 'bg-stone-500';
              if (day.totalCarbs > day.targetMax) barColor = 'bg-rose-500';
              if (day.totalCarbs === 0) barColor = 'bg-stone-800'; // No data
              
              return (
                <div 
                  key={day.date} 
                  className="flex-1 flex flex-col items-center group relative"
                  title={\`\${day.totalCarbs}g (Target: \${day.targetMin}-\${day.targetMax}g)\`}
                >
                  {/* Tooltip on hover/tap */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-stone-800 text-white text-[10px] font-mono px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    {day.totalCarbs}g
                  </div>
                  
                  {/* Chart Area */}
                  <div className="w-full h-full relative rounded-t-sm overflow-hidden flex items-end justify-center">
                    {/* Target Band */}
                    <div 
                      className="absolute w-full bg-stone-800/80 rounded-sm z-0"
                      style={{ bottom: \`\${targetBottom}%\`, height: \`\${targetHeight}%\` }}
                    />
                    
                    {/* Actual Bar */}
                    <div 
                      className={\`w-full rounded-t-sm relative z-10 transition-all duration-500 \${barColor}\`}
                      style={{ height: \`\${barHeight}%\` }}
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
        </div>`;

content = content.replace(streakDiv, streakDiv + '\\n' + chartDiv);
fs.writeFileSync('src/views/ProgressView.tsx', content);

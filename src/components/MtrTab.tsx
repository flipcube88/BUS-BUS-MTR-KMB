import React, { useState, useEffect } from 'react';
import { Train, Clock, AlertCircle, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MTR_LINES, MTR_STATIONS, STATION_NAMES } from '@/lib/mtr-data';
import { getMtrSchedule, MtrSchedule, MtrEta } from '@/lib/mtr-service';
import { useFavorites } from '@/lib/useFavorites';

export default function MtrTab() {
  const [selectedLine, setSelectedLine] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [schedule, setSchedule] = useState<MtrSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mtrFavs, toggleMtrFav, isMtrFav } = useFavorites();

  useEffect(() => {
    if (selectedLine && selectedStation) {
      fetchSchedule();
      const interval = setInterval(fetchSchedule, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [selectedLine, selectedStation]);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    const data = await getMtrSchedule(selectedLine, selectedStation);
    if (data) {
      setSchedule(data);
    } else {
      setSchedule(null);
      setError('No schedule data available or API error.');
    }
    setLoading(false);
  };

  const handleLineChange = (val: string) => {
    setSelectedLine(val);
    setSelectedStation('');
    setSchedule(null);
  };

  const renderEtaList = (etas?: MtrEta[], direction?: string) => {
    if (!etas || etas.length === 0) return <div className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center bg-slate-50 dark:bg-slate-900 rounded-xl">No trains available</div>;

    return (
      <div className="space-y-3 mt-3">
        {etas.map((eta, index) => {
          const isArriving = eta.ttnt === '0';
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index} 
              className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">To {STATION_NAMES[eta.dest] || eta.dest}</span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Platform {eta.plat}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-2xl font-black leading-none ${isArriving ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {isArriving ? 'Now' : eta.ttnt}
                  {!isArriving && <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-1">min</span>}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">{eta.time.split(' ')[1].substring(0, 5)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const lineInfo = MTR_LINES.find(l => l.code === selectedLine);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
      {/* Selection Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 z-10 shadow-sm space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Select Line</label>
          <Select value={selectedLine} onValueChange={handleLineChange}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-blue-500 rounded-xl h-12 dark:text-slate-100">
              <SelectValue placeholder="Choose MTR Line" />
            </SelectTrigger>
            <SelectContent className="rounded-xl dark:bg-slate-900 dark:border-slate-800">
              {MTR_LINES.map(line => (
                <SelectItem key={line.code} value={line.code} className="rounded-lg cursor-pointer dark:focus:bg-slate-800">
                  <div className="flex items-center font-medium dark:text-slate-200">
                    <div 
                      className="w-3 h-3 rounded-full mr-3 shadow-sm" 
                      style={{ backgroundColor: line.color }}
                    />
                    {line.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Select Station</label>
          <Select value={selectedStation} onValueChange={setSelectedStation} disabled={!selectedLine}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-blue-500 rounded-xl h-12 dark:text-slate-100">
              <SelectValue placeholder="Choose Station" />
            </SelectTrigger>
            <SelectContent className="rounded-xl dark:bg-slate-900 dark:border-slate-800">
              {selectedLine && MTR_STATIONS[selectedLine]?.map(station => (
                <SelectItem key={station.code} value={station.code} className="rounded-lg cursor-pointer font-medium dark:text-slate-200 dark:focus:bg-slate-800">
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {!selectedLine || !selectedStation ? (
          <div className="absolute inset-0 flex flex-col p-4 overflow-y-auto">
            {mtrFavs.length > 0 ? (
              <div className="space-y-3 pb-20">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center ml-1">
                  <Star className="w-3.5 h-3.5 mr-1.5 fill-yellow-400 text-yellow-400" /> Saved Stations
                </h3>
                {mtrFavs.map(fav => (
                  <div 
                    key={fav.id} 
                    onClick={() => {
                      setSelectedLine(fav.line);
                      setSelectedStation(fav.station);
                    }}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm mr-3 shrink-0" style={{ backgroundColor: fav.color }}>
                        <Train className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight">{fav.stationName}</div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400" style={{ color: fav.color }}>{fav.lineName}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); toggleMtrFav(fav); }}>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 p-8 text-center mt-10">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Train className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-medium text-slate-600 dark:text-slate-400">Select a station</p>
                <p className="text-sm mt-1">Choose a line and station to see live train times.</p>
              </div>
            )}
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="p-4 pb-20">
              {/* Station Header */}
              <AnimatePresence>
                {lineInfo && selectedStation && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md mr-4 shrink-0"
                      style={{ backgroundColor: lineInfo.color }}
                    >
                      <Train className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{STATION_NAMES[selectedStation]}</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400" style={{ color: lineInfo.color }}>{lineInfo.name}</p>
                    </div>
                    <div className="flex items-center ml-auto">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleMtrFav({ id: `${selectedLine}_${selectedStation}`, line: selectedLine, station: selectedStation, lineName: lineInfo.name, stationName: STATION_NAMES[selectedStation], color: lineInfo.color })} 
                        className="h-8 w-8 rounded-full"
                      >
                        <Star className={`w-5 h-5 ${isMtrFav(`${selectedLine}_${selectedStation}`) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && !schedule && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                  <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="font-medium">Loading schedule...</p>
                </div>
              )}
              
              {error && (
                <div className="flex flex-col items-center justify-center py-8 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-2xl p-6 text-center border border-red-100 dark:border-red-900/30">
                  <AlertCircle className="mb-2 h-8 w-8 opacity-50" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {schedule && (
                <div className="space-y-8">
                  {schedule.UP && schedule.UP.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 ml-1 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mr-2"></div>
                        Up Track
                      </h3>
                      {renderEtaList(schedule.UP)}
                    </div>
                  )}
                  
                  {schedule.DOWN && schedule.DOWN.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 ml-1 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mr-2"></div>
                        Down Track
                      </h3>
                      {renderEtaList(schedule.DOWN)}
                    </div>
                  )}

                  {(!schedule.UP || schedule.UP.length === 0) && (!schedule.DOWN || schedule.DOWN.length === 0) && (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <Clock className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">No schedule data available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

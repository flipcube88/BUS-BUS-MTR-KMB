import React, { useState, useEffect } from 'react';
import { Search, Bus, Clock, ArrowRight, AlertCircle, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { getCtbRoute, getCtbRouteStops, getCtbStop, getCtbEta, CtbRoute, CtbRouteStop, CtbStop, CtbEta } from '@/lib/ctb-service';
import { useFavorites } from '@/lib/useFavorites';

const formatTime = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' });
};

const getMinutesLeft = (isoString: string) => {
  if (!isoString) return null;
  const diff = new Date(isoString).getTime() - new Date().getTime();
  const mins = Math.floor(diff / 60000);
  return mins < 0 ? 0 : mins;
};

export default function CtbTab() {
  const [routeInput, setRouteInput] = useState('');
  const [routeInfo, setRouteInfo] = useState<CtbRoute | null>(null);
  const [bound, setBound] = useState<'inbound' | 'outbound'>('outbound');
  const [stops, setStops] = useState<(CtbRouteStop & { stopDetails?: CtbStop })[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [etas, setEtas] = useState<CtbEta[]>([]);
  const [etaLoading, setEtaLoading] = useState(false);

  const { ctbFavs, toggleCtbFav, isCtbFav } = useFavorites();

  const searchRoute = async (overrideRoute?: string, overrideBound?: 'inbound' | 'outbound', overrideStopId?: string) => {
    const r = overrideRoute || routeInput;
    const b = overrideBound || bound;
    if (!r) return;
    setLoading(true);
    setRouteInfo(null);
    setStops([]);
    setSelectedStop(null);
    setEtas([]);

    const routeUpper = r.trim().toUpperCase();
    const info = await getCtbRoute(routeUpper);
    if (info) {
      setRouteInfo(info);
      const routeStops = await getCtbRouteStops(routeUpper, b);
      setStops(routeStops);
      
      // Fetch stop details in background
      Promise.all(
        routeStops.map(async (rs) => {
          const details = await getCtbStop(rs.stop);
          return { ...rs, stopDetails: details || undefined };
        })
      ).then((detailedStops) => {
        setStops(detailedStops);
        
        // If there's an override stop ID, scroll to it after a short delay
        if (overrideStopId) {
          setTimeout(() => {
            const el = document.getElementById(`stop-${overrideStopId}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        }
      });

      if (overrideStopId) {
        setSelectedStop(overrideStopId);
        setEtaLoading(true);
        const etaData = await getCtbEta(overrideStopId, routeUpper);
        const dir = b === 'outbound' ? 'O' : 'I';
        setEtas(etaData.filter(e => e.dir === dir));
        setEtaLoading(false);
      }
    } else {
      // Handle case where route is not found
      setRouteInfo(null);
      setStops([]);
    }
    setLoading(false);
  };

  const toggleBound = () => {
    const newBound = bound === 'outbound' ? 'inbound' : 'outbound';
    setBound(newBound);
    if (routeInput && routeInfo) {
      searchRoute(routeInput, newBound);
    }
  };

  const handleClear = () => {
    setRouteInput('');
    setRouteInfo(null);
    setStops([]);
    setSelectedStop(null);
  };

  const handleStopClick = async (stopId: string) => {
    if (selectedStop === stopId) {
      setSelectedStop(null);
      return;
    }
    setSelectedStop(stopId);
    setEtaLoading(true);
    const etaData = await getCtbEta(stopId, routeInput.trim().toUpperCase());
    const dir = bound === 'outbound' ? 'O' : 'I';
    setEtas(etaData.filter(e => e.dir === dir));
    setEtaLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 z-10 shadow-sm">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <Input 
              placeholder="Enter Bus Route (e.g. 8X)" 
              value={routeInput}
              onChange={(e) => setRouteInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchRoute()}
              className="pl-9 pr-9 bg-slate-100 dark:bg-slate-800 border-transparent focus-visible:ring-blue-500 rounded-xl dark:text-slate-100"
            />
            {routeInput && (
              <button 
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button 
            onClick={() => searchRoute()} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Route Header */}
      <AnimatePresence>
        {routeInfo && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-900 px-4 py-3 border-b dark:border-slate-800 shadow-sm z-10 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-lg px-2 py-0 rounded-md font-bold">
                  {routeInfo.route}
                </Badge>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CTB</span>
              </div>
              <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mt-1.5">
                <span>{bound === 'outbound' ? routeInfo.orig_tc : routeInfo.dest_tc}</span>
                <ArrowRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-500" />
                <span>{bound === 'outbound' ? routeInfo.dest_tc : routeInfo.orig_tc}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleCtbFav({ 
                  id: `${routeInfo.route}_${bound}`, 
                  route: routeInfo.route, 
                  bound, 
                  orig_tc: bound === 'outbound' ? routeInfo.orig_tc : routeInfo.dest_tc, 
                  dest_tc: bound === 'outbound' ? routeInfo.dest_tc : routeInfo.orig_tc 
                })} 
                className="h-8 w-8 rounded-full"
              >
                <Star className={`w-4 h-4 ${isCtbFav(`${routeInfo.route}_${bound}`) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400 dark:text-slate-500'}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={toggleBound} className="rounded-full h-8 px-3 text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300">
                Swap Dir.
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Finding route...</p>
          </div>
        ) : !routeInfo && !loading ? (
          <div className="absolute inset-0 flex flex-col p-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 p-8 text-center mt-10">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Bus className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">Where are you going?</p>
              <p className="text-sm mt-1">Search for a CTB route to see live arrival times.</p>
            </div>
          </div>
        ) : stops.length > 0 ? (
          <ScrollArea className="h-full w-full">
            <div className="p-4 pb-20">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
                
                {stops.map((stop, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={stop.seq} 
                    id={`stop-${stop.stop}`}
                    className="relative pl-10 mb-2"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-[11px] top-[14px] w-[10px] h-[10px] rounded-full border-2 bg-white dark:bg-slate-900 z-10 transition-colors ${selectedStop === stop.stop ? 'border-blue-600 scale-125' : 'border-blue-300 dark:border-blue-800'}`} />
                    
                    <div 
                      className={`p-3 rounded-2xl cursor-pointer transition-all ${selectedStop === stop.stop ? 'bg-white dark:bg-slate-900 shadow-md border border-blue-100 dark:border-blue-900/30 ring-1 ring-blue-600/10 dark:ring-blue-500/20' : 'hover:bg-white/60 dark:hover:bg-slate-800/60'}`}
                      onClick={() => handleStopClick(stop.stop)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={`font-semibold transition-colors ${selectedStop === stop.stop ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {stop.stopDetails?.name_tc || 'Loading...'}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stop.stopDetails?.name_en || ''}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (routeInfo) {
                              toggleCtbFav({ 
                                id: `${routeInfo.route}_${bound}_${stop.stop}`, 
                                route: routeInfo.route, 
                                bound, 
                                orig_tc: bound === 'outbound' ? routeInfo.orig_tc : routeInfo.dest_tc, 
                                dest_tc: bound === 'outbound' ? routeInfo.dest_tc : routeInfo.orig_tc,
                                stopId: stop.stop,
                                stopName: stop.stopDetails?.name_tc || ''
                              });
                            }
                          }} 
                          className="h-8 w-8 rounded-full ml-2 shrink-0"
                        >
                          <Star className={`w-4 h-4 ${isCtbFav(`${routeInfo?.route}_${bound}_${stop.stop}`) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        </Button>
                      </div>
                      
                      {/* ETA Dropdown */}
                      <AnimatePresence>
                        {selectedStop === stop.stop && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                Next Buses
                              </h4>
                              
                              {etaLoading ? (
                                <div className="flex space-x-2 animate-pulse">
                                  <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1"></div>
                                  <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1"></div>
                                </div>
                              ) : etas.length > 0 ? (
                                <div className="space-y-2">
                                  {etas.map((eta, i) => {
                                    const mins = getMinutesLeft(eta.eta);
                                    const isArriving = mins === 0;
                                    return (
                                      <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${i === 0 ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30' : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800'}`}>
                                        <div className="flex flex-col">
                                          <span className={`text-2xl font-bold leading-none ${isArriving ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {mins === null ? '-' : isArriving ? 'Now' : mins}
                                            {!isArriving && mins !== null && <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">min</span>}
                                          </span>
                                          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{formatTime(eta.eta)}</span>
                                        </div>
                                        {eta.rmk_tc && (
                                          <Badge variant="outline" className="bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                                            {eta.rmk_tc}
                                          </Badge>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                  <AlertCircle className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                                  No scheduled buses
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </div>
    </div>
  );
}

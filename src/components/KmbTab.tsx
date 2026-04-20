import React, { useState, useEffect } from 'react';
import { Search, Bus, Clock, ArrowRight, MapPin, AlertCircle, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { getKmbRoute, getKmbRouteStops, getKmbStop, getKmbEta, KmbRoute, KmbRouteStop, KmbStop, KmbEta } from '@/lib/kmb-service';
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

export default function KmbTab() {
  const [routeInput, setRouteInput] = useState('');
  const [routeInfo, setRouteInfo] = useState<KmbRoute | null>(null);
  const [bound, setBound] = useState<'inbound' | 'outbound'>('outbound');
  const [stops, setStops] = useState<(KmbRouteStop & { stopDetails?: KmbStop })[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [etas, setEtas] = useState<KmbEta[]>([]);
  const [etaLoading, setEtaLoading] = useState(false);

  const { kmbFavs, toggleKmbFav, isKmbFav } = useFavorites();

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
    const info = await getKmbRoute(routeUpper, b);
    if (info) {
      setRouteInfo(info);
      const routeStops = await getKmbRouteStops(routeUpper, b);
      setStops(routeStops);
      
      // Fetch stop details in background
      Promise.all(
        routeStops.map(async (rs) => {
          const details = await getKmbStop(rs.stop);
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
        const etaData = await getKmbEta(overrideStopId, routeUpper);
        const dir = b === 'outbound' ? 'O' : 'I';
        setEtas(etaData.filter(e => e.dir === dir));
        setEtaLoading(false);
      }
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
    const etaData = await getKmbEta(stopId, routeInput.trim().toUpperCase());
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
              placeholder="Enter Bus Route (e.g. 1A)" 
              value={routeInput}
              onChange={(e) => setRouteInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchRoute()}
              className="pl-9 pr-9 bg-slate-100 dark:bg-slate-800 border-transparent focus-visible:ring-red-500 rounded-xl dark:text-slate-100"
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
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
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
                <Badge variant="destructive" className="text-lg px-2 py-0 rounded-md font-bold">
                  {routeInfo.route}
                </Badge>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">KMB</span>
              </div>
              <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mt-1.5">
                <span>{routeInfo.orig_tc}</span>
                <ArrowRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-500" />
                <span>{routeInfo.dest_tc}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleKmbFav({ id: `${routeInfo.route}_${bound}`, route: routeInfo.route, bound, orig_tc: routeInfo.orig_tc, dest_tc: routeInfo.dest_tc })} 
                className="h-8 w-8 rounded-full"
              >
                <Star className={`w-4 h-4 ${isKmbFav(`${routeInfo.route}_${bound}`) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400 dark:text-slate-500'}`} />
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
            <div className="w-8 h-8 border-4 border-red-200 dark:border-red-900/50 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Finding route...</p>
          </div>
        ) : !routeInfo && !loading ? (
          <div className="absolute inset-0 flex flex-col p-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 p-8 text-center mt-10">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Bus className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">Where are you going?</p>
              <p className="text-sm mt-1">Search for a KMB route to see live arrival times.</p>
            </div>
          </div>
        ) : stops.length > 0 ? (
          <ScrollArea className="h-full w-full">
            <div className="p-4 pb-20">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-red-100 dark:bg-red-900/30 rounded-full"></div>
                
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
                    <div className={`absolute left-[11px] top-[14px] w-[10px] h-[10px] rounded-full border-2 bg-white dark:bg-slate-900 z-10 transition-colors ${selectedStop === stop.stop ? 'border-red-600 scale-125' : 'border-red-300 dark:border-red-800'}`} />
                    
                    <div 
                      className={`p-3 rounded-2xl cursor-pointer transition-all ${selectedStop === stop.stop ? 'bg-white dark:bg-slate-900 shadow-md border border-red-100 dark:border-red-900/30 ring-1 ring-red-600/10 dark:ring-red-500/20' : 'hover:bg-white/60 dark:hover:bg-slate-800/60'}`}
                      onClick={() => handleStopClick(stop.stop)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={`font-semibold transition-colors ${selectedStop === stop.stop ? 'text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
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
                              toggleKmbFav({ 
                                id: `${routeInfo.route}_${bound}_${stop.stop}`, 
                                route: routeInfo.route, 
                                bound, 
                                orig_tc: routeInfo.orig_tc, 
                                dest_tc: routeInfo.dest_tc,
                                stopId: stop.stop,
                                stopName: stop.stopDetails?.name_tc || ''
                              });
                            }
                          }} 
                          className="h-8 w-8 rounded-full ml-2 shrink-0"
                        >
                          <Star className={`w-4 h-4 ${isKmbFav(`${routeInfo?.route}_${bound}_${stop.stop}`) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
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
                                      <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${i === 0 ? 'bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30' : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800'}`}>
                                        <div className="flex flex-col">
                                          <span className={`text-2xl font-bold leading-none ${isArriving ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
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


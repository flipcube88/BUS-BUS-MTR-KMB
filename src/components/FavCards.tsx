import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, AlertCircle, Train } from 'lucide-react';
import { getKmbEta, KmbEta } from '@/lib/kmb-service';
import { getCtbEta, CtbEta } from '@/lib/ctb-service';
import { getMtrSchedule, MtrSchedule, MtrEta } from '@/lib/mtr-service';
import { STATION_NAMES } from '@/lib/mtr-data';
import { FavoriteKmb, FavoriteCtb, FavoriteMtr } from '@/lib/useFavorites';

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

export function KmbFavCard({ fav, onToggleFav }: { fav: FavoriteKmb, onToggleFav: (fav: FavoriteKmb) => void, key?: React.Key }) {
  const [etas, setEtas] = useState<KmbEta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchEta = async () => {
      if (!fav.stopId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const etaData = await getKmbEta(fav.stopId, fav.route);
      if (!mounted) return;
      const dir = fav.bound === 'outbound' ? 'O' : 'I';
      setEtas(etaData.filter(e => e.dir === dir).slice(0, 2));
      setLoading(false);
    };

    fetchEta();
    const interval = setInterval(fetchEta, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fav]);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="destructive" className="px-2 py-0 rounded-md font-bold">{fav.route}</Badge>
            {fav.stopName && (
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{fav.stopName}</span>
            )}
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{fav.orig_tc}</span>
            <ArrowRight className="w-3 h-3 mx-1.5" />
            <span>{fav.dest_tc}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0" onClick={(e) => { e.stopPropagation(); onToggleFav(fav); }}>
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </Button>
      </div>

      {fav.stopId && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mt-1">
          {loading && etas.length === 0 ? (
            <div className="flex space-x-2 animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex-1"></div>
            </div>
          ) : etas.length > 0 ? (
            <div className="flex space-x-3">
              {etas.map((eta, i) => {
                const mins = getMinutesLeft(eta.eta);
                const isArriving = mins === 0;
                return (
                  <div key={i} className="flex items-baseline space-x-1">
                    <span className={`text-lg font-bold leading-none ${isArriving ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {mins === null ? '-' : isArriving ? 'Now' : mins}
                    </span>
                    {!isArriving && mins !== null && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">min</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> No scheduled buses
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CtbFavCard({ fav, onToggleFav }: { fav: FavoriteCtb, onToggleFav: (fav: FavoriteCtb) => void, key?: React.Key }) {
  const [etas, setEtas] = useState<CtbEta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchEta = async () => {
      if (!fav.stopId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const etaData = await getCtbEta(fav.stopId, fav.route);
      if (!mounted) return;
      const dir = fav.bound === 'outbound' ? 'O' : 'I';
      setEtas(etaData.filter(e => e.dir === dir).slice(0, 2));
      setLoading(false);
    };

    fetchEta();
    const interval = setInterval(fetchEta, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fav]);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge className="bg-blue-600 hover:bg-blue-700 px-2 py-0 rounded-md font-bold">{fav.route}</Badge>
            {fav.stopName && (
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{fav.stopName}</span>
            )}
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{fav.orig_tc}</span>
            <ArrowRight className="w-3 h-3 mx-1.5" />
            <span>{fav.dest_tc}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0" onClick={(e) => { e.stopPropagation(); onToggleFav(fav); }}>
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </Button>
      </div>

      {fav.stopId && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mt-1">
          {loading && etas.length === 0 ? (
            <div className="flex space-x-2 animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex-1"></div>
            </div>
          ) : etas.length > 0 ? (
            <div className="flex space-x-3">
              {etas.map((eta, i) => {
                const mins = getMinutesLeft(eta.eta);
                const isArriving = mins === 0;
                return (
                  <div key={i} className="flex items-baseline space-x-1">
                    <span className={`text-lg font-bold leading-none ${isArriving ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {mins === null ? '-' : isArriving ? 'Now' : mins}
                    </span>
                    {!isArriving && mins !== null && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">min</span>}
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> No scheduled buses
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MtrFavCard({ fav, onToggleFav }: { fav: FavoriteMtr, onToggleFav: (fav: FavoriteMtr) => void, key?: React.Key }) {
  const [schedule, setSchedule] = useState<MtrSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSchedule = async () => {
      setLoading(true);
      const data = await getMtrSchedule(fav.line, fav.station);
      if (!mounted) return;
      if (data) {
        setSchedule(data);
      }
      setLoading(false);
    };

    fetchSchedule();
    const interval = setInterval(fetchSchedule, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fav]);

  const renderEta = (etas?: MtrEta[]) => {
    if (!etas || etas.length === 0) return null;
    const eta = etas[0];
    const isArriving = eta.ttnt === '0';
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400 truncate mr-2">To {STATION_NAMES[eta.dest] || eta.dest}</span>
        <span className={`font-bold shrink-0 ${isArriving ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
          {isArriving ? 'Now' : `${eta.ttnt} min`}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm mr-3 shrink-0" style={{ backgroundColor: fav.color }}>
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight">{fav.stationName}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400" style={{ color: fav.color }}>{fav.lineName}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0" onClick={(e) => { e.stopPropagation(); onToggleFav(fav); }}>
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </Button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mt-1 space-y-2">
        {loading && !schedule ? (
          <div className="flex flex-col space-y-2 animate-pulse">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
        ) : schedule && (schedule.UP?.length || schedule.DOWN?.length) ? (
          <>
            {renderEta(schedule.UP)}
            {renderEta(schedule.DOWN)}
          </>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" /> No schedule data
          </div>
        )}
      </div>
    </div>
  );
}

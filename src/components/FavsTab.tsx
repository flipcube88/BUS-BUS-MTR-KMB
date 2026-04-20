import React from 'react';
import { useFavorites } from '@/lib/useFavorites';
import { KmbFavCard, CtbFavCard, MtrFavCard } from './FavCards';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star } from 'lucide-react';

export default function FavsTab() {
  const { kmbFavs, ctbFavs, mtrFavs, toggleKmbFav, toggleCtbFav, toggleMtrFav } = useFavorites();

  const hasFavs = kmbFavs.length > 0 || ctbFavs.length > 0 || mtrFavs.length > 0;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
      {!hasFavs ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="font-medium text-slate-600 dark:text-slate-400">No favorites yet</p>
          <p className="text-sm mt-1">Save your frequently used stops and stations to see them all here.</p>
        </div>
      ) : (
        <ScrollArea className="h-full w-full">
          <div className="p-4 pb-20 space-y-4">
            {kmbFavs.map(fav => <KmbFavCard key={fav.id} fav={fav} onToggleFav={toggleKmbFav} />)}
            {ctbFavs.map(fav => <CtbFavCard key={fav.id} fav={fav} onToggleFav={toggleCtbFav} />)}
            {mtrFavs.map(fav => <MtrFavCard key={fav.id} fav={fav} onToggleFav={toggleMtrFav} />)}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

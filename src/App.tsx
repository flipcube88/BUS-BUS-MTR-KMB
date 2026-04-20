/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KmbTab from "@/components/KmbTab";
import CtbTab from "@/components/CtbTab";
import MtrTab from "@/components/MtrTab";
import FavsTab from "@/components/FavsTab";
import { Bus, Train, LogIn, LogOut, Star } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { auth, loginWithGoogle, logout } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-950 flex justify-center items-center p-0 md:p-8 font-sans transition-colors duration-300">
      <div className="w-full md:max-w-md bg-white dark:bg-slate-900 md:rounded-[2.5rem] md:shadow-2xl overflow-hidden flex flex-col h-[100dvh] md:h-[850px] md:max-h-[90vh] border-0 md:border-[6px] border-slate-800/5 dark:border-slate-100/5 relative transition-colors duration-300">
        {/* App Header */}
        <div className="bg-white dark:bg-slate-900 pt-[max(env(safe-area-inset-top),2rem)] md:pt-8 pb-4 px-6 text-center border-b dark:border-slate-800 z-10 relative shadow-sm flex justify-between items-center transition-colors duration-300">
          <div className="w-10">
            {user ? (
              <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="h-8 w-8 rounded-full text-slate-500">
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={loginWithGoogle} title="Login to Sync" className="h-8 w-8 rounded-full text-slate-500">
                <LogIn className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              HK Transit
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">Live ETA</p>
          </div>
          <div className="w-10 flex justify-end">
            <ModeToggle />
          </div>
        </div>
        
        <Tabs defaultValue="favs" className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b dark:border-slate-800 h-14 bg-white dark:bg-slate-900 p-0 transition-colors duration-300">
            <TabsTrigger 
              value="favs" 
              className="data-active:bg-purple-50 dark:data-active:bg-purple-950/30 data-active:text-purple-600 dark:data-active:text-purple-400 data-active:border-b-2 data-active:border-purple-600 dark:data-active:border-purple-500 rounded-none h-full text-slate-500 dark:text-slate-400 transition-all"
            >
              <Star className="w-4 h-4 mr-1.5" />
              <span className="font-semibold text-sm">Favs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kmb" 
              className="data-active:bg-red-50 dark:data-active:bg-red-950/30 data-active:text-red-600 dark:data-active:text-red-400 data-active:border-b-2 data-active:border-red-600 dark:data-active:border-red-500 rounded-none h-full text-slate-500 dark:text-slate-400 transition-all"
            >
              <Bus className="w-4 h-4 mr-1.5" />
              <span className="font-semibold text-sm">KMB</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ctb" 
              className="data-active:bg-yellow-50 dark:data-active:bg-yellow-950/30 data-active:text-yellow-600 dark:data-active:text-yellow-400 data-active:border-b-2 data-active:border-yellow-600 dark:data-active:border-yellow-500 rounded-none h-full text-slate-500 dark:text-slate-400 transition-all"
            >
              <Bus className="w-4 h-4 mr-1.5" />
              <span className="font-semibold text-sm">CTB</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mtr" 
              className="data-active:bg-blue-50 dark:data-active:bg-blue-950/30 data-active:text-blue-600 dark:data-active:text-blue-400 data-active:border-b-2 data-active:border-blue-600 dark:data-active:border-blue-500 rounded-none h-full text-slate-500 dark:text-slate-400 transition-all"
            >
              <Train className="w-4 h-4 mr-1.5" />
              <span className="font-semibold text-sm">MTR</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="favs" className="absolute inset-0 m-0 outline-none flex flex-col">
              <FavsTab />
            </TabsContent>
            <TabsContent value="kmb" className="absolute inset-0 m-0 outline-none flex flex-col">
              <KmbTab />
            </TabsContent>
            <TabsContent value="ctb" className="absolute inset-0 m-0 outline-none flex flex-col">
              <CtbTab />
            </TabsContent>
            <TabsContent value="mtr" className="absolute inset-0 m-0 outline-none flex flex-col">
              <MtrTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

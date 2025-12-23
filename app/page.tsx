import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlShortener from "@/components/UrlShortener";
import QrGenerator from "@/components/QrGenerator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Github } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xl">
              U
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400">
              UtilityApp
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:flex hover:bg-white/20">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </div>
        </header>

        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight pb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Simplify Your Links & Codes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            A modern, privacy-focused utility tool. Generate stats-tracked short links and customizable QR codes instantly.
          </p>
        </div>

        <Tabs defaultValue="shorten" className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500 delay-300">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl mb-8 shadow-lg">
            <TabsTrigger 
              value="shorten" 
              className="rounded-xl h-full text-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md transition-all"
            >
              Link Shortener
            </TabsTrigger>
            <TabsTrigger 
              value="qrcode" 
              className="rounded-xl h-full text-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md transition-all"
            >
              QR Generator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shorten" className="focus-visible:outline-none ring-offset-0">
             <UrlShortener />
          </TabsContent>
          <TabsContent value="qrcode" className="focus-visible:outline-none ring-offset-0">
            <QrGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

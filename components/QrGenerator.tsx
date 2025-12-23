"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QrGenerator() {
  const [content, setContent] = useState("");
  const [size, setSize] = useState([300]);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce generation or manual? The prompt says "Preview before download".
  // Real-time preview is nice. But calling API on every keystroke is bad.
  // I'll call API when content changes with debounce or button click.
  // For "Real-time preview", local generation is better, but requirements say "POST /api/qrcode".
  // I will use a "Generate" button or debounce. A button is safer for API calls.
  // But prompt says "Real-time preview of generated items" in Frontend Phase 3.
  // I'll use debounce for the API call.

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        generateQr();
      } else {
        setQrCode(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [content, size, fgColor, bgColor]);

  const generateQr = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const res = await fetch("/api/qrcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          size: size[0],
          fgColor,
          bgColor,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQrCode(data.qrCode);
    } catch (error: any) {
      toast.error("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const downloadQr = (format: "png" | "svg") => {
    if (!qrCode) return;
    
    // The API returns base64 PNG data URL by default right now.
    // If format is SVG, I need to request SVG from API or handle it.
    // Current API implementation in phase 2 only mentioned Base64 PNG or SVG.
    // My implemented API returns `qrCode: string`. Using `QRCode.toDataURL`.
    // It is PNG. `toDataURL` creates PNG.
    // To support SVG, I'd need to update API to return SVG string if requested.
    // For now, I'll only support PNG download since the API currently does that.
    // Unless I update API to accept format.
    // I will stick to PNG for now as "Base64 PNG" is what I implemented.
    
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="glass-card border-none md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            Customize QR Code
          </CardTitle>
          <CardDescription>
            Enter text or URL and customize the appearance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter text or URL"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="glass-input resize-none h-32"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Size: {size}px</Label>
              <Slider
                value={size}
                onValueChange={setSize}
                min={100}
                max={1000}
                step={10}
                className="cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fgColor">Foreground</Label>
                <div className="flex items-center gap-2">
                   <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-12 p-1 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">{fgColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 p-1 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-1 flex flex-col items-center justify-center p-8 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl min-h-[400px]">
        {loading ? (
           <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        ) : qrCode ? (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="relative group">
              <img
                src={qrCode}
                alt="Generated QR Code"
                className="max-w-[300px] w-full rounded-xl shadow-lg border-4 border-white transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => downloadQr("png")} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg">
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground space-y-4">
            <RefreshCw className="h-16 w-16 mx-auto opacity-20" />
            <p className="text-lg">Enter content to preview QR code</p>
          </div>
        )}
      </div>
    </div>
  );
}

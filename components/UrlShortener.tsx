"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setShortUrl(data.shortUrl);
      toast.success("URL shortened successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <Card className="glass-card border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Shorten a URL
          </CardTitle>
          <CardDescription>
            Enter a long link to create a short, shareable URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Long URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/path"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="glass-input h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Shortening...
                </>
              ) : (
                <>
                  Shorten URL <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {shortUrl && (
            <div className="mt-8 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 animate-in fade-in slide-in-from-bottom-4">
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Your Short URL
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={shortUrl}
                  readOnly
                  className="bg-transparent border-none text-lg font-semibold text-blue-600 h-auto p-0 focus-visible:ring-0"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copyToClipboard}
                  className="hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-blue-600" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";

interface ApiKeyInputProps {
  onKeySubmit: (key: string) => void;
  isLoading: boolean;
}

const ApiKeyInput = ({ onKeySubmit, isLoading }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    // Save to localStorage
    localStorage.setItem("gemini_api_key", apiKey);
    setIsKeySet(true);
    onKeySubmit(apiKey);
    toast.success("API key saved");
  };

  // Check localStorage on mount
  useState(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySet(true);
      onKeySubmit(savedKey);
    }
  });

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">Google Gemini API Key</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Get your API key from{" "}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple underline"
                >
                  Google AI Studio
                </a>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="pr-10"
            disabled={isLoading}
          />
          <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button type="submit" disabled={isLoading || !apiKey.trim()}>
          {isKeySet ? "Update" : "Save"}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-2">
        Your API key is stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
};

export default ApiKeyInput;

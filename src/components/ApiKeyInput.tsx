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
    localStorage.setItem("mistral_api_key", apiKey);
    setIsKeySet(true);
    onKeySubmit(apiKey);
    toast.success("API key saved");
  };

  // Check localStorage on mount
  useState(() => {
    const savedKey = localStorage.getItem("mistral_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySet(true);
      onKeySubmit(savedKey);
    }
  });

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">Mistral API Configuration</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                The API key is configured in the backend environment variables.
                Contact your administrator if you need access.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        API authentication is handled securely through environment variables.
      </p>
    </div>
  );
};

export default ApiKeyInput;

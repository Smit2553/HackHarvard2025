"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { SettingsSection } from "./settings-section";

export function PracticeSection() {
  const [defaultLanguage, setDefaultLanguage] = useState("python");
  const [sessionLength, setSessionLength] = useState("45");
  const [difficulty, setDifficulty] = useState("mixed");

  const handleSave = () => {
    toast.success("Practice preferences saved", {
      description: "Your practice settings have been updated.",
    });
  };

  return (
    <SettingsSection
      id="practice"
      title="Practice preferences"
      description="Set your default interview settings"
    >
      <div className="space-y-2">
        <Label htmlFor="language" className="text-sm font-medium">
          Preferred language
        </Label>
        <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
          <SelectTrigger className="max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Default language for new practice sessions
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="session-length" className="text-sm font-medium">
          Session length
        </Label>
        <Select value={sessionLength} onValueChange={setSessionLength}>
          <SelectTrigger className="max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes (recommended)</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Typical technical interview duration
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty" className="text-sm font-medium">
          Problem difficulty
        </Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="mixed">Mixed (recommended)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Start with mixed for realistic practice
        </p>
      </div>

      <div className="pt-2">
        <button className="w-full max-w-md rounded-lg border p-4 text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Test microphone</p>
                <p className="text-xs text-muted-foreground">
                  Ensure your audio is working properly
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </button>
      </div>

      <div className="pt-2">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Save changes
        </Button>
      </div>
    </SettingsSection>
  );
}

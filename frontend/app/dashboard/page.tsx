"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { SimpleFooter } from "@/components/simple-footer";
import { StatCard } from "@/components/progress/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  List,
  Shuffle,
  ArrowRight,
  Clock,
  Target,
  Calendar,
  Sparkles,
  TrendingUp,
  Monitor,
} from "lucide-react";

interface Transcript {
  id: number;
  call_duration: number;
  user_messages: number;
  assistant_messages: number;
  created_at: string;
}

interface AuthData {
  isLoggedIn: boolean;
  user?: {
    email: string;
    name: string;
    fullName?: string;
    avatar: string;
    experience?: string;
    status?: string;
    company?: string | null;
    plan?: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://harvardapi.codestacx.com";
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  const [userName, setUserName] = useState<string>("there");
  const [targetCompany, setTargetCompany] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("offscript_auth");
      if (stored) {
        const auth: AuthData = JSON.parse(stored);
        if (auth?.user) {
          const first =
            auth.user.fullName?.split(" ")[0] || auth.user.name || "there";
          setUserName(first);
          setTargetCompany(auth.user.company || "");
        }
      }
    } catch (e) {
      console.warn("Failed to parse auth", e);
    }
  }, []);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://harvardapi.codestacx.com/api/transcripts",
        );
        if (!response.ok) throw new Error("Failed to fetch transcripts");
        const data = await response.json();
        setTranscripts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchTranscripts();
  }, []);

  const checkIfMobile = (): boolean => {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
        userAgent,
      );
    const isSmallScreen = width < 1024;
    return isMobileDevice || isSmallScreen;
  };

  const handleInterviewNavigation = (href: string) => {
    if (checkIfMobile()) {
      setShowMobileWarning(true);
      return;
    }
    router.push(href);
  };

  const totalPracticeTime = useMemo(
    () => transcripts.reduce((sum, t) => sum + (t.call_duration || 0), 0),
    [transcripts],
  );

  const avgSessionLength = useMemo(() => {
    if (transcripts.length === 0) return 0;
    return Math.round(totalPracticeTime / transcripts.length);
  }, [totalPracticeTime, transcripts.length]);

  const thisWeekSessions = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return transcripts.filter((t) => new Date(t.created_at) > weekAgo).length;
  }, [transcripts]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "yesterday";
    return `${days}d ago`;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const recommendedCopy = useMemo(() => {
    if (targetCompany) {
      return {
        title: `Try a ${targetCompany} problem`,
        desc: "Medium difficulty • Arrays & Hashing",
        badges: ["Target Company", "Popular"],
        href: `/interview?company=${targetCompany.toLowerCase()}`,
      };
    }
    if (transcripts.length === 0) {
      return {
        title: "Start with an easy problem",
        desc: "Arrays & Strings • 15-20 minutes",
        badges: ["Beginner Friendly"],
        href: "/interview?difficulty=easy",
      };
    }
    return {
      title: "Continue with Trees & Graphs",
      desc: "Medium difficulty • Build on recent practice",
      badges: ["Recommended"],
      href: "/interview",
    };
  }, [transcripts.length, targetCompany]);

  const handleScrapeLeetCode = async () => {
    if (!leetcodeUrl.trim()) {
      setScrapeError("Please enter a LeetCode URL");
      return;
    }

    if (checkIfMobile()) {
      setShowMobileWarning(true);
      return;
    }

    setIsScraping(true);
    setScrapeError(null);
    try {
      const response = await fetch(`${API_URL}/api/scrape_leetcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: leetcodeUrl }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to scrape problem");
      }
      const data = await response.json();
      router.push(`/interview?problemId=${data.problem_id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setScrapeError(message);
    } finally {
      setIsScraping(false);
    }
  };

  const practiceOptions = [
    {
      id: "all-problems",
      title: "All problems",
      description:
        "Browse and filter problems by difficulty, topic, or company",
      icon: List,
      stats: "500+ problems • Easy to Hard",
      href: "/practice/problems",
      highlight: false,
    },
    {
      id: "companies",
      title: "Company based",
      description:
        "Practice problems from specific companies you're interviewing with",
      icon: Building2,
      stats: "Google, Meta, Amazon, and 150+ more",
      href: "/practice/companies",
      highlight: !!targetCompany,
    },
    {
      id: "random",
      title: "Random problem",
      description: "Jump into a random problem to keep things interesting",
      icon: Shuffle,
      stats: "Surprise me with any difficulty",
      href: "/interview",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <section className="mb-16">
            <div className="max-w-3xl mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                Good {getTimeOfDay()}, {userName}! Ready to practice?
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                {transcripts.length > 0
                  ? `You've completed ${thisWeekSessions} sessions this week. ${thisWeekSessions >= 5 ? "Great consistency!" : "Keep the momentum going!"}`
                  : "Start your interview practice journey with personalized recommendations"}
              </p>
            </div>

            <Card className="mb-10">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                        AI Recommendation
                      </span>
                      {recommendedCopy.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="text-xs"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {recommendedCopy.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {recommendedCopy.desc}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      className="group"
                      onClick={() =>
                        handleInterviewNavigation(recommendedCopy.href)
                      }
                    >
                      Start Interview
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {practiceOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-all ${option.highlight ? "ring-1 ring-foreground/20" : ""}`}
                    onClick={() => handleInterviewNavigation(option.href)}
                  >
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {option.stats}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <div className="border-t pt-8">
                <div className="text-center mb-4">
                  <h3 className="text-base font-medium">
                    Have your own problem?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Paste a LeetCode URL to practice a specific problem
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="https://leetcode.com/problems/two-sum/"
                    value={leetcodeUrl}
                    onChange={(e) => setLeetcodeUrl(e.target.value)}
                    className="flex-1"
                    disabled={isScraping}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isScraping) {
                        void handleScrapeLeetCode();
                      }
                    }}
                  />
                  <Button
                    onClick={handleScrapeLeetCode}
                    disabled={isScraping || !leetcodeUrl.trim()}
                    className="sm:w-auto w-full"
                  >
                    {isScraping ? "Loading..." : "Start Interview"}
                  </Button>
                </div>

                {scrapeError && (
                  <p className="text-sm text-destructive mt-3 text-center">
                    {scrapeError}
                  </p>
                )}

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Works with any LeetCode problem URL
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Your progress</h2>
              <button
                onClick={() => router.push("/progress")}
                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View detailed stats →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                icon={Clock}
                title="Total Practice"
                value={formatDuration(totalPracticeTime)}
                subtitle={`${transcripts.length} sessions`}
                variant="plain"
              />
              <StatCard
                icon={TrendingUp}
                title="Avg Session"
                value={formatDuration(avgSessionLength)}
                subtitle="Per interview"
                variant="plain"
              />
              <StatCard
                icon={Calendar}
                title="This Week"
                value={thisWeekSessions.toString()}
                subtitle="Sessions"
                variant="plain"
              />
              <StatCard
                icon={Target}
                title="Focus"
                value={targetCompany || "General"}
                subtitle="Target"
                variant="plain"
              />
            </div>
          </section>

          <section className="pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent sessions</h2>
              <button
                onClick={() => router.push("/progress")}
                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all sessions →
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-20 rounded-lg border border-border/50 animate-pulse bg-muted/30" />
                <div className="h-20 rounded-lg border border-border/50 animate-pulse bg-muted/30" />
              </div>
            ) : transcripts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No sessions yet. Ready to start?
                  </p>
                  <Button
                    onClick={() => router.push("/practice/problems")}
                    variant="outline"
                  >
                    Begin Your First Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {transcripts.slice(0, 3).map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => router.push(`/scores/${t.id}`)}
                    className="w-full text-left p-5 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium">Session #{t.id}</span>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDuration(t.call_duration)} •{" "}
                          {formatTimeAgo(t.created_at)}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <SimpleFooter />

      <AlertDialog open={showMobileWarning} onOpenChange={setShowMobileWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-center">
              Desktop Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              The interview practice environment requires a desktop or laptop
              computer with a larger screen. Please access this feature from a
              computer to practice your coding interviews with voice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowMobileWarning(false)}
              className="w-full sm:w-auto"
            >
              Got it
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

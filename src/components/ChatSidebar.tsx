import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSession {
  id: string;
  title: string;
  date: string;
  isActive?: boolean;
}

export const ChatSidebar = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "1", title: "Patient Consultation - John D.", date: "Today", isActive: true },
    { id: "2", title: "Follow-up Notes - Sarah M.", date: "Yesterday" },
    { id: "3", title: "Emergency Visit - Robert K.", date: "2 days ago" },
    { id: "4", title: "Annual Checkup - Lisa T.", date: "3 days ago" },
  ]);

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Clinical Note",
      date: "Now",
      isActive: true
    };
    
    setSessions(prev => [
      newSession,
      ...prev.map(session => ({ ...session, isActive: false }))
    ]);
  };

  return (
    <div className="chat-sidebar w-64 h-full p-4 flex flex-col">
      <div className="mb-6">
        <Button 
          onClick={handleNewSession}
          className="w-full justify-start hover:bg-primary/90 transition-colors"
        >
          <span className="material-icons mr-2">add</span>
          New Note
        </Button>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-muted mb-3">Recent Sessions</h3>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  session.isActive
                    ? "bg-accent/10 border border-accent/20"
                    : "hover:bg-medical-hover"
                }`}
              >
                <div className="font-medium text-sm truncate">{session.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{session.date}</div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-6 pt-4 border-t border-medical-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="material-icons text-sm text-accent">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Dr. Clinical</div>
            <div className="text-xs text-muted-foreground">Physician</div>
          </div>
        </div>
      </div>
    </div>
  );
};
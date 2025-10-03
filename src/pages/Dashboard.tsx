import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { AudioRecorder } from "@/components/AudioRecorder";
import { NoteViewer } from "@/components/NoteViewer";
import { ConversationBar } from "@/components/ConversationBar";
import { SettingsSheet } from "@/components/SettingsSheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
interface ChatSession {
  id: string;
  title: string;
  date: string;
  isActive?: boolean;
  note?: {
    id: string;
    title: string;
    created_at: string;
    transcription: string;
    structured_note: string | null;
    audio_duration: number | null;
  };
}
const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleTextMessage = async (message: string) => {
    console.log("Text message sent:", message);
    // TODO: Implement text message handling
    // This could integrate with OpenAI API or other conversational AI
  };
  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    console.log("Voice toggled:", !isVoiceActive);
    // TODO: Implement voice recording/conversation logic
  };
  return <div className="h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <ChatSidebar onSessionSelect={setActiveSession} activeSessionId={activeSession?.id || null} />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <ChatSidebar 
              onSessionSelect={(session) => {
                setActiveSession(session);
                setSidebarOpen(false);
              }} 
              activeSessionId={activeSession?.id || null} 
            />
          </SheetContent>
        </Sheet>
      )}
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-14 md:h-16 border-b border-medical-border bg-white/50 backdrop-blur-sm flex items-center justify-between px-3 md:px-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden"
              >
                <span className="material-icons">menu</span>
              </Button>
            )}
            <h1 className="text-lg md:text-xl font-bold tracking-tighter">PRAXIS</h1>
            <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">ClinicalNotes AI</span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <SettingsSheet />
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')} 
              className="border-medical-border hover:bg-medical-hover"
            >
              <span className="material-icons mr-0 md:mr-2 text-sm">logout</span>
              <span className="hidden md:inline">Salir</span>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative pb-20 md:pb-24 overflow-auto">
          {activeSession?.note ? <NoteViewer note={activeSession.note} /> : <AudioRecorder />}
        </main>
      </div>

      {/* Conversation Bar */}
      <ConversationBar onTextMessage={handleTextMessage} onVoiceToggle={handleVoiceToggle} isVoiceActive={isVoiceActive} />
    </div>;
};
export default Dashboard;
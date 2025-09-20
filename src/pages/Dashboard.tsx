import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { AudioRecorder } from "@/components/AudioRecorder";
import { NoteViewer } from "@/components/NoteViewer";
import { ConversationBar } from "@/components/ConversationBar";
import { SettingsSheet } from "@/components/SettingsSheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
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
      <ChatSidebar onSessionSelect={setActiveSession} activeSessionId={activeSession?.id || null} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-medical-border bg-white/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold tracking-tighter">PRAXIS</h1>
            <span className="text-sm text-muted-foreground">ClinicalNotes AI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <SettingsSheet />
            
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="border-medical-border hover:bg-medical-hover">
              <span className="material-icons mr-2 text-sm">logout</span>
              Salir
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative pb-24"> {/* Added padding bottom for conversation bar */}
          {activeSession?.note ? <NoteViewer note={activeSession.note} /> : <AudioRecorder />}
        </main>
      </div>

      {/* Conversation Bar */}
      <ConversationBar onTextMessage={handleTextMessage} onVoiceToggle={handleVoiceToggle} isVoiceActive={isVoiceActive} />
    </div>;
};
export default Dashboard;
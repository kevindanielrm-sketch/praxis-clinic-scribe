import { ChatSidebar } from "@/components/ChatSidebar";
import { AudioRecorder } from "@/components/AudioRecorder";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-background flex">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-medical-border bg-white/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold tracking-tighter">PRAXIS</h1>
            <span className="text-sm text-muted-foreground">ClinicalNotes</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-medical-border hover:bg-medical-hover"
            >
              <span className="material-icons mr-2 text-sm">settings</span>
              Settings
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="border-medical-border hover:bg-medical-hover"
            >
              <span className="material-icons mr-2 text-sm">logout</span>
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative">
          <AudioRecorder />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
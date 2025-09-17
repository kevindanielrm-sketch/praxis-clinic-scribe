import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter">
              Designing the{" "}
              <span className="underline decoration-4 decoration-accent">
                next frontier
              </span>{" "}
              in clinical care
            </h1>
          </div>
          
          <div className="hidden md:flex justify-center items-center">
            <div className="w-full max-w-md h-96 bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-accent/30 rounded-full flex items-center justify-center">
                  <span className="material-icons text-4xl text-accent">psychology</span>
                </div>
                <p className="text-muted-foreground">AI-Powered Clinical Documentation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="medical-card p-8 rounded-lg">
            <p className="text-sm font-semibold text-muted">CLINICALNOTES</p>
            <h2 className="text-2xl font-bold mt-2">Meet ClinicalNotes AI</h2>
            <p className="mt-2 text-muted-foreground">
              Our first AI-powered tool to streamline clinical documentation and reduce administrative burden.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="mt-6 w-full md:w-auto hover:bg-primary/90 transition-colors"
            >
              Explore ClinicalNotes
            </Button>
          </div>
          
          <div className="medical-card p-8 rounded-lg">
            <p className="text-sm font-semibold text-muted">API</p>
            <h2 className="text-2xl font-bold mt-2">Build with Praxis</h2>
            <p className="mt-2 text-muted-foreground">
              Create HIPAA-compliant applications and custom experiences using our secure healthcare API.
            </p>
            <Button 
              variant="secondary"
              className="mt-6 w-full md:w-auto border border-medical-border hover:bg-medical-hover transition-colors"
            >
              Learn more
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
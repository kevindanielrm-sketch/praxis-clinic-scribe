import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="py-4 px-8 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold tracking-tighter">PRAXIS</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <a className="flex items-center hover:text-muted transition-colors" href="#">
          Products 
          <span className="material-icons text-base ml-1">expand_more</span>
        </a>
        <a className="flex items-center hover:text-muted transition-colors" href="#">
          About Us 
          <span className="material-icons text-base ml-1">expand_more</span>
        </a>
        <a className="flex items-center hover:text-muted transition-colors" href="#">
          Research 
          <span className="material-icons text-base ml-1">expand_more</span>
        </a>
        <a className="flex items-center hover:text-muted transition-colors" href="#">
          Commitments 
          <span className="material-icons text-base ml-1">expand_more</span>
        </a>
        <a className="flex items-center hover:text-muted transition-colors" href="#">
          Learn 
          <span className="material-icons text-base ml-1">expand_more</span>
        </a>
        <a className="hover:text-muted transition-colors" href="#">News</a>
      </nav>

      <Button 
        onClick={() => navigate('/login')}
        className="hover:bg-primary/90 transition-colors"
      >
        Try ClinicalNotes
      </Button>
    </header>
  );
};
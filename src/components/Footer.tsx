import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-medical-border bg-background px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Logo and tagline */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">PRAXIS</h2>
          <p className="text-muted-foreground">
            Designing the next frontier in clinical care.
          </p>
        </div>

        {/* Main navigation */}
        <nav className="mb-6">
          <ul className="flex flex-wrap gap-4 md:gap-8 text-sm">
            <li>
              <Link to="/products" className="text-foreground hover:text-primary transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/research" className="text-foreground hover:text-primary transition-colors">
                Research
              </Link>
            </li>
            <li>
              <Link to="/learn" className="text-foreground hover:text-primary transition-colors">
                Learn
              </Link>
            </li>
            <li>
              <Link to="/news" className="text-foreground hover:text-primary transition-colors">
                News
              </Link>
            </li>
          </ul>
        </nav>

        {/* Secondary links */}
        <nav className="mb-6 pb-6 border-b border-medical-border">
          <ul className="flex flex-wrap gap-4 md:gap-6 text-sm text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          © 2025 Praxis Health Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export { Footer };

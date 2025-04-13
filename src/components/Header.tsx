
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-purple" />
          <h1 className="text-lg md:text-xl font-bold">PitchDeck Analyzer</h1>
        </div>
        
        {isMobile ? (
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="p-2 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
            
            {mobileMenuOpen && (
              <nav className="absolute right-0 top-full mt-2 py-2 w-48 bg-background shadow-lg rounded-lg border z-50">
                <ul className="flex flex-col">
                  <li>
                    <a 
                      href="/" 
                      className="block px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#about" 
                      className="block px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      How It Works
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        ) : (
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <a href="/" className="text-sm font-medium hover:text-purple transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm font-medium hover:text-purple transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

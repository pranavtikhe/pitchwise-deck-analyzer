
import { BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-purple" />
          <h1 className="text-xl font-bold">PitchDeck Analyzer</h1>
        </div>
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
      </div>
    </header>
  );
};

export default Header;

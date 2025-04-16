
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // return (
   
  // )
};

export default Header;

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";
import { FaSun } from "react-icons/fa";
interface ThemeToggleProps {
  size?: number;
  className?: string;
  iconLight?: string;
  iconDark?: string;
  bgLight?: string;
  bgDark?: string;
}

export default function ThemeToggle({
  size = 14,
  className = "w-7 h-7 rounded-md flex items-center justify-center",
  iconLight = "text-blue-900",
  iconDark = "text-primary",
  bgLight = "bg-primary/15",
  bgDark = "bg-primary/15",
}: ThemeToggleProps) {
  const { isLight, toggle } = useTheme();

  return (
    <button onClick={toggle} className={`${isLight ? bgLight : bgDark} ${className}`}>
      {isLight ? <Moon size={size} className={iconLight} /> : <FaSun size={size} className={iconDark} />}
    </button>
  );
}

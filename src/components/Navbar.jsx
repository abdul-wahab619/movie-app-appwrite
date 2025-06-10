// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // or use your own icons

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // check localStorage or system preference
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-[#030014] dark:bg-zinc-900 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-zinc-300 dark:text-white">
        🎬 MovieHub
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        className="text-zinc-300 dark:text-white p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-800 hover:text-zinc-700 transition-colors"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </nav>
  );
};

export default Navbar;

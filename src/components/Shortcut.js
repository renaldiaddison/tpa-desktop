import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Shortcut = ({ children }) => {
  const nav = useNavigate();

  const handleKey = useCallback((e) => {
    if (e.altKey === true) {
      if (e.key == "h") {
        nav("/home");
      }
      if (e.key == "p") {
        nav("/public");
      }
      if (e.key == "c") {
        nav("/closedBoards");
      }
      if (e.key == "f") {
        nav("/favoriteBoard");
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return <>{children}</>;
};

export default Shortcut;

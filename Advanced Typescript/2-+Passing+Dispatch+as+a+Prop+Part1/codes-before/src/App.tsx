import { useState } from "react";
import ColorSelect from "./components/color-selector";
import SetColors from "./components/set-colors";
import ColorGroups from "./components/color-group";
import SavedColors from "./components/saved-colors";
import "./App.css";

function App() {
  const [hexColor, setHexColor] = useState("#c2025e");
  return (
    <div className="grid">
      <ColorSelect
        hexColor={hexColor}
        onChange={(e) => setHexColor(e.target.value)}
      />
      <SetColors hexColor={hexColor} />
      <ColorGroups hexColor={hexColor} />
      <SavedColors hexColor={hexColor} />
    </div>
  );
}

export default App;

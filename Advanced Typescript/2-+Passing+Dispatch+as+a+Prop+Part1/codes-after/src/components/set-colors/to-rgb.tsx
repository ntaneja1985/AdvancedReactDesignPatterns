import { hex } from "color-convert"; // Importing the color-convert library
import LabeledInput from "../common/labeled-input"; // Importing the LabeledInput component

const containerStyle: React.CSSProperties = {
  display: "grid",
  width: "100%",
  gridAutoFlow: "column",
  gap: "0.5rem",
};

type HexToRGBProps = {
  hexColor: string;
};

const HexToRGB = ({ hexColor }: HexToRGBProps) => {
  // Convert the hexColor to RGB format using color-convert library
  const color = hex.rgb(hexColor);
  const [r, g, b] = color;

  return (
    <section style={containerStyle}>
      {/* Display LabeledInput components for each RGB component */}
      <LabeledInput label="R" type="number" value={r} />
      <LabeledInput label="G" type="number" value={g} />
      <LabeledInput label="B" type="number" value={b} />
    </section>
  );
};

export default HexToRGB;

import { AbsoluteFill } from "remotion";

export const Main: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#fff", fontSize: 72, fontFamily: "sans-serif" }}>
        Guerrilla AI Video Editor
      </h1>
    </AbsoluteFill>
  );
};

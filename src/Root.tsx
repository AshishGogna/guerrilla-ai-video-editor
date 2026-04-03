import { Composition } from "remotion";
import { Main } from "./Main";
import config from "../public/composition.json";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={config.durationInFrames}
      fps={config.fps}
      width={config.width}
      height={config.height}
    />
  );
};

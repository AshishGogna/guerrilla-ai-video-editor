import React from 'react';
import {AbsoluteFill, Audio, Sequence, Video, staticFile, useCurrentFrame, interpolate, spring} from 'remotion';

const fps = 24;

const TrailerClip: React.FC<{
  start: number;
  duration: number;
  from: number;
  scaleFrom?: number;
}> = ({start, duration, from, scaleFrom = 1.06}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - start;
  const scale = interpolate(localFrame, [0, 8], [scaleFrom, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={start} durationInFrames={duration}>
      <AbsoluteFill style={{opacity, overflow: 'hidden', backgroundColor: 'black'}}>
        <Video
          src={staticFile('trailer.mp4')}
          startFrom={from}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
          }}
        />
        <AbsoluteFill
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 100%)',
          }}
        />
      </AbsoluteFill>
    </Sequence>
  );
};

const TalkingHead: React.FC<{
  start: number;
  duration: number;
  from: number;
}> = ({start, duration, from}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - start;
  const entrance = spring({
    fps,
    frame: Math.max(0, localFrame),
    config: {damping: 200, stiffness: 180},
  });
  const scale = interpolate(entrance, [0, 1], [1.04, 1]);
  const opacity = interpolate(localFrame, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={start} durationInFrames={duration}>
      <AbsoluteFill style={{backgroundColor: 'black', opacity}}>
        <Video
          src={staticFile('ashish.mp4')}
          startFrom={from}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
          }}
        />
        <AbsoluteFill
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.34) 100%)',
          }}
        />
      </AbsoluteFill>
    </Sequence>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <Audio src={staticFile('ashish.mp4')} />

      <TalkingHead start={0} duration={120} from={0} />

      <TrailerClip start={120} duration={36} from={120} scaleFrom={1.08} />
      <TrailerClip start={156} duration={24} from={144} scaleFrom={1.05} />
      <TrailerClip start={180} duration={24} from={294} scaleFrom={1.07} />
      <TrailerClip start={204} duration={30} from={1980} scaleFrom={1.06} />
      <TrailerClip start={234} duration={30} from={2424} scaleFrom={1.08} />
      <TrailerClip start={264} duration={24} from={2544} scaleFrom={1.04} />
      <TrailerClip start={288} duration={24} from={2514} scaleFrom={1.06} />
      <TrailerClip start={312} duration={40} from={1248} scaleFrom={1.05} />
      <TrailerClip start={352} duration={40} from={3552} scaleFrom={1.07} />
      <TrailerClip start={392} duration={97} from={4032} scaleFrom={1.04} />

      <TalkingHead start={489} duration={56} from={744} />
      <TalkingHead start={545} duration={248} from={660} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
} from 'remotion';

const FPS = 24;
const ts = (mmss: string) => {
  const [m, s] = mmss.split(':').map(Number);
  return Math.round((m * 60 + s) * FPS);
};
const t = (seconds: number) => Math.round(seconds * FPS);

const TrailerFit: React.FC<{start: string}> = ({start}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <OffthreadVideo
        src={staticFile('trailer.mp4')}
        startFrom={ts(start)}
        muted
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};

const SpeakerFull: React.FC<{startSeconds: number}> = ({startSeconds}) => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <OffthreadVideo
        src={staticFile('ashish.mp4')}
        startFrom={t(startSeconds)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <Audio src={staticFile('ashish.mp4')} />

      {/* Cut 1: Open on the speaker to establish the reviewer and hook the audience with the first claim. */}
      <Sequence from={t(0)} durationInFrames={t(5.26)}>
        <SpeakerFull startSeconds={0} />
      </Sequence>

      {/* Cut 2: Switch to the trailer exactly as the voiceover starts describing cosmic chaos and the dog-in-space visual. */}
      <Sequence from={t(5.26)} durationInFrames={t(4.82)}>
        <TrailerFit start="01:48" />
      </Sequence>

      {/* Cut 3: Match the line about goons in a neon dive bar with the clearest bar-threat setup from the trailer. */}
      <Sequence from={t(10.08)} durationInFrames={t(4.26)}>
        <TrailerFit start="01:25" />
      </Sequence>

      {/* Cut 4: Escalate into pure action to sell the 'badass while everything explodes' line with nonstop combat imagery. */}
      <Sequence from={t(14.34)} durationInFrames={t(6.2)}>
        <TrailerFit start="02:00" />
      </Sequence>

      {/* Cut 5: Land the heat-vision mention on the exact heat-vision shots for strongest visual-word sync. */}
      <Sequence from={t(20.54)} durationInFrames={t(4.12)}>
        <TrailerFit start="01:50" />
      </Sequence>

      {/* Cut 6: Bring the speaker back in the middle for the theatrical callout so the CTA feels direct and personal. */}
      <Sequence from={t(24.66)} durationInFrames={t(2.78)}>
        <SpeakerFull startSeconds={24.66} />
      </Sequence>

      {/* Cut 7: Stay on the speaker through the closing share-and-follow CTA to end with personality and continuity. */}
      <Sequence from={t(27.44)} durationInFrames={t(5.62)}>
        <SpeakerFull startSeconds={27.44} />
      </Sequence>
    </AbsoluteFill>
  );
};

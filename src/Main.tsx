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

const LandscapeContainedVideo: React.FC<{
  src: string;
  startFrom?: number;
  muted?: boolean;
}> = ({src, startFrom = 0, muted = true}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <OffthreadVideo
        src={src}
        startFrom={startFrom}
        muted={muted}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/* Track A1: Main dialogue track using only the reviewer’s continuous audio */}
      <AbsoluteFill>
        <Sequence from={ts('00:00')} durationInFrames={ts('00:33')}>
          <Audio src={staticFile('ashish.mp4')} startFrom={ts('00:00')} />
        </Sequence>
      </AbsoluteFill>

      {/* Track V1: Primary top video layer */}
      <AbsoluteFill>
        {/* Cut placed at the start to open on the reviewer on camera and establish the hook. */}
        <Sequence from={ts('00:00')} durationInFrames={ts('00:05')}>
          <OffthreadVideo
            src={staticFile('ashish.mp4')}
            startFrom={ts('00:00')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* Cut placed here to match the spoken line about floating in space with a dog using the trailer cabin shot. */}
        <Sequence from={ts('00:05')} durationInFrames={ts('00:05')}>
          <LandscapeContainedVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('00:05')}
            muted
          />
        </Sequence>

        {/* Cut placed here to match the dive bar / goons line with the neon bar confrontation setup. */}
        <Sequence from={ts('00:10')} durationInFrames={ts('00:04')}>
          <LandscapeContainedVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('01:25')}
            muted
          />
        </Sequence>

        {/* Cut placed here to support the badass / explosions line with escalating action footage. */}
        <Sequence from={ts('00:14')} durationInFrames={ts('00:03')}>
          <LandscapeContainedVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('02:00')}
            muted
          />
        </Sequence>
        {/* Cut placed immediately after to continue the same spoken idea with more explosive combat footage. */}
        <Sequence from={ts('00:17')} durationInFrames={ts('00:03')}>
          <LandscapeContainedVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('02:33')}
            muted
          />
        </Sequence>

        {/* Cut placed here to match the heat vision line with the strongest exact heat-vision visual. */}
        <Sequence from={ts('00:20')} durationInFrames={ts('00:02')}>
          <LandscapeContainedVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('01:50')}
            muted
          />
        </Sequence>
        {/* Cut placed immediately after to continue the line with red-eye close-up attitude footage. */}
        <Sequence from={ts('00:22')} durationInFrames={ts('00:03')}>
          <LandscapeContainedVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('02:27')}
            muted
          />
        </Sequence>

        {/* Cut placed here to bring the reviewer back on camera for the release-date line. */}
        <Sequence from={ts('00:25')} durationInFrames={ts('00:03')}>
          <OffthreadVideo
            src={staticFile('ashish.mp4')}
            startFrom={ts('00:25')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* Cut placed here for a brief heroic trailer punctuation under the share prompt. */}
        <Sequence from={ts('00:28')} durationInFrames={ts('00:02')}>
          <LandscapeContainedVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('02:41')}
            muted
          />
        </Sequence>

        {/* Cut placed at the end to finish on the reviewer for the creator-led signoff. */}
        <Sequence from={ts('00:30')} durationInFrames={ts('00:03')}>
          <OffthreadVideo
            src={staticFile('ashish.mp4')}
            startFrom={ts('00:30')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

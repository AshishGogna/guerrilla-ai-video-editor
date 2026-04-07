import React from 'react';
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  registerRoot,
} from 'remotion';

const FPS = 24;
const ts = (t: string) => { const [h, m, s, ms] = t.split(':').map(Number); return Math.round((h * 3600 + m * 60 + s + ms / 1000) * FPS); };
const dur = (t: string) => Math.max(1, ts(t));

const SubtitleChunk: React.FC<{
  text: string;
  sourceStart: string;
  duration: string;
}> = ({text, sourceStart, duration}) => {
  const frame = useCurrentFrame();
  const durationFrames = dur(duration);
  const words = text.toUpperCase().split(' ');
  const wordDuration = durationFrames / words.length;
  const enterFrames = Math.max(2, Math.round(0.12 * FPS));
  const fadeOutFrames = Math.max(2, Math.round(0.08 * FPS));

  const bounce = spring({
    fps: FPS,
    frame,
    config: {
      damping: 11,
      stiffness: 220,
      mass: 0.7,
    },
    durationInFrames: enterFrames + 3,
  });

  const scale = interpolate(bounce, [0, 1], [0.92, 1]);
  const translateY = interpolate(bounce, [0, 1], [12, 0]);
  const opacity = frame >= durationFrames - fadeOutFrames
    ? interpolate(frame, [durationFrames - fadeOutFrames, durationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;

  const absoluteStart = ts(sourceStart);
  const currentAbsoluteFrame = absoluteStart + frame;
  const activeWordIndex = Math.min(
    words.length - 1,
    Math.max(0, Math.floor((currentAbsoluteFrame - absoluteStart) / wordDuration))
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 576,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.25em',
          maxWidth: 900,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          fontSize: 72,
          lineHeight: 1.05,
          textAlign: 'center',
          textTransform: 'uppercase',
          WebkitTextStroke: '8px black',
          paintOrder: 'stroke fill',
          textShadow: '0 6px 12px rgba(0,0,0,0.45)',
        }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            style={{
              color: i === activeWordIndex ? '#FFE600' : 'white',
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const LaconicReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const enterFrames = Math.max(3, Math.round(0.18 * FPS));
  const totalFrames = dur('00:00:02:200');
  const exitFrames = Math.max(4, Math.round(0.22 * FPS));
  const exitStart = totalFrames - exitFrames;

  const inSpring = spring({
    fps: FPS,
    frame,
    config: {
      damping: 9,
      stiffness: 240,
      mass: 0.8,
    },
    durationInFrames: enterFrames + 4,
  });

  const enterScale = interpolate(inSpring, [0, 1], [1.6, 1]);
  const enterRotate = interpolate(inSpring, [0, 1], [20, 0]);

  const shakeX = frame <= 2 ? (frame % 2 === 0 ? -10 : 10) : 0;
  const shakeY = frame <= 2 ? (frame % 2 === 0 ? 6 : -6) : 0;

  const exitProgress = frame >= exitStart
    ? interpolate(frame, [exitStart, totalFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;

  const finalScale = interpolate(exitProgress, [0, 1], [enterScale, 0.85]);
  const finalY = interpolate(exitProgress, [0, 1], [height * 0.05 + shakeY, -140]);
  const finalOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const finalRotate = interpolate(exitProgress, [0, 1], [enterRotate, -8]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          transform: `translate(${shakeX}px, ${finalY}px) scale(${finalScale}) rotate(${finalRotate}deg)`,
          opacity: finalOpacity,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 190,
            backgroundColor: 'rgba(255, 51, 51, 0.85)',
            borderRadius: 32,
            transform: 'rotate(-7deg)',
            boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
          }}
        />
        {[
          {w: 180, h: 6, x: -330, y: -70, r: -18},
          {w: 140, h: 6, x: 320, y: -90, r: 15},
          {w: 150, h: 6, x: -300, y: 90, r: 12},
          {w: 120, h: 6, x: 300, y: 80, r: -14},
          {w: 90, h: 6, x: 0, y: -150, r: 0},
          {w: 90, h: 6, x: 0, y: 150, r: 0},
        ].map((line, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: line.w,
              height: line.h,
              backgroundColor: 'white',
              borderRadius: 999,
              transform: `translate(${line.x}px, ${line.y}px) rotate(${line.r}deg)`,
              opacity: 0.9,
            }}
          />
        ))}
        <div
          style={{
            position: 'relative',
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontWeight: 900,
            fontSize: 164,
            lineHeight: 1,
            color: '#FFE600',
            WebkitTextStroke: '14px black',
            paintOrder: 'stroke fill',
            textShadow: '0 12px 0 rgba(0,0,0,0.5), 0 20px 30px rgba(0,0,0,0.35)',
            letterSpacing: '-0.03em',
          }}
        >
          LACONIC
        </div>
      </div>
    </AbsoluteFill>
  );
};

const VerticalVideo: React.FC<{
  src: string;
  startFromTime: string;
  scale: number;
  translateYPercent: number;
}> = ({src, startFromTime, scale, translateYPercent}) => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black', overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={ts(startFromTime)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateY(${translateYPercent}%)`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <AbsoluteFill>
        {/* Hook opener starts at timeline 0 to begin immediately with the first speaking portion and a tight energetic crop. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={dur('00:00:05:820')}>
          <VerticalVideo src="rwfzqy/1.mp4" startFromTime="00:00:00:000" scale={1.35} translateYPercent={-8} />
        </Sequence>

        {/* Hard cut to the second speaking clip exactly where the first ends to maintain continuous pacing with a slightly wider crop. */}
        <Sequence from={ts('00:00:05:820')} durationInFrames={dur('00:00:03:340')}>
          <VerticalVideo src="rwfzqy/2.mp4" startFromTime="00:00:00:000" scale={1.22} translateYPercent={-6} />
        </Sequence>

        {/* Hard cut into clip three at its spoken reveal source start so the silent setup is removed and the punch-in lands on the key line. */}
        <Sequence from={ts('00:00:09:160')} durationInFrames={dur('00:00:01:740')}>
          <VerticalVideo src="rwfzqy/3.mp4" startFromTime="00:00:00:600" scale={1.45} translateYPercent={-10} />
        </Sequence>

        {/* Hard cut to the definition section with a medium-tight crop that keeps face and gestures visible while continuing synced audio. */}
        <Sequence from={ts('00:00:10:900')} durationInFrames={dur('00:00:05:440')}>
          <VerticalVideo src="rwfzqy/4.mp4" startFromTime="00:00:00:000" scale={1.28} translateYPercent={-5} />
        </Sequence>

        {/* Final hard cut to the farewell clip, preserving the wave in frame and ending cleanly before post-speech silence. */}
        <Sequence from={ts('00:00:16:340')} durationInFrames={dur('00:00:02:000')}>
          <VerticalVideo src="rwfzqy/5.mp4" startFromTime="00:00:00:000" scale={1.2} translateYPercent={-4} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Subtitle chunk appears for the first spoken words and disappears before the next chunk. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={dur('00:00:00:420')}>
          <SubtitleChunk text="What do you" sourceStart="00:00:00:000" duration="00:00:00:420" />
        </Sequence>

        {/* Subtitle chunk continues the hook in the next timed spoken window. */}
        <Sequence from={ts('00:00:00:420')} durationInFrames={dur('00:00:00:580')}>
          <SubtitleChunk text="call that friend" sourceStart="00:00:00:420" duration="00:00:00:580" />
        </Sequence>

        {/* Subtitle chunk matches the next three-word spoken phrase. */}
        <Sequence from={ts('00:00:01:000')} durationInFrames={dur('00:00:00:720')}>
          <SubtitleChunk text="who replies to" sourceStart="00:00:01:000" duration="00:00:00:720" />
        </Sequence>

        {/* Subtitle chunk covers the next spoken phrase and clears before the next one arrives. */}
        <Sequence from={ts('00:00:01:720')} durationInFrames={dur('00:00:00:840')}>
          <SubtitleChunk text="your long message" sourceStart="00:00:01:720" duration="00:00:00:840" />
        </Sequence>

        {/* Subtitle chunk emphasizes the concise response phrase in sync with speech. */}
        <Sequence from={ts('00:00:02:560')} durationInFrames={dur('00:00:00:900')}>
          <SubtitleChunk text="with just okay" sourceStart="00:00:02:560" duration="00:00:00:900" />
        </Sequence>

        {/* Subtitle chunk advances the sentence while preserving the fast one-chunk-at-a-time rhythm. */}
        <Sequence from={ts('00:00:03:460')} durationInFrames={dur('00:00:00:960')}>
          <SubtitleChunk text="and somehow ends" sourceStart="00:00:03:460" duration="00:00:00:960" />
        </Sequence>

        {/* Subtitle chunk lands the end of the opening question. */}
        <Sequence from={ts('00:00:04:420')} durationInFrames={dur('00:00:01:400')}>
          <SubtitleChunk text="the whole conversation" sourceStart="00:00:04:420" duration="00:00:01:400" />
        </Sequence>

        {/* Subtitle chunk starts the second clip immediately on its opening spoken line. */}
        <Sequence from={ts('00:00:05:820')} durationInFrames={dur('00:00:00:820')}>
          <SubtitleChunk text="Did you know" sourceStart="00:00:05:820" duration="00:00:00:820" />
        </Sequence>

        {/* Subtitle chunk continues the setup for the reveal with three spoken words. */}
        <Sequence from={ts('00:00:06:640')} durationInFrames={dur('00:00:01:040')}>
          <SubtitleChunk text="there's actually a" sourceStart="00:00:06:640" duration="00:00:01:040" />
        </Sequence>

        {/* Subtitle chunk completes the setup phrase before the reveal. */}
        <Sequence from={ts('00:00:07:680')} durationInFrames={dur('00:00:01:480')}>
          <SubtitleChunk text="word for this" sourceStart="00:00:07:680" duration="00:00:01:480" />
        </Sequence>

        {/* Subtitle chunk displays the reveal line across the full reveal clip duration. */}
        <Sequence from={ts('00:00:09:160')} durationInFrames={dur('00:00:01:740')}>
          <SubtitleChunk text="The word is laconic" sourceStart="00:00:09:160" duration="00:00:01:740" />
        </Sequence>

        {/* Subtitle chunk begins the definition exactly as the explanation starts. */}
        <Sequence from={ts('00:00:10:900')} durationInFrames={dur('00:00:00:980')}>
          <SubtitleChunk text="Laconic means using" sourceStart="00:00:10:900" duration="00:00:00:980" />
        </Sequence>

        {/* Subtitle chunk highlights the concise-definition phrase in its short spoken window. */}
        <Sequence from={ts('00:00:11:880')} durationInFrames={dur('00:00:0:400')}>
          <SubtitleChunk text="very few words" sourceStart="00:00:11:880" duration="00:00:0:400" />
        </Sequence>

        {/* Subtitle chunk continues the definition line by line with no overlap. */}
        <Sequence from={ts('00:00:12:280')} durationInFrames={dur('00:00:01:080')}>
          <SubtitleChunk text="in a way" sourceStart="00:00:12:280" duration="00:00:01:080" />
        </Sequence>

        {/* Subtitle chunk carries the next descriptive phrase of the definition. */}
        <Sequence from={ts('00:00:13:360')} durationInFrames={dur('00:00:00:920')}>
          <SubtitleChunk text="that sounds brief" sourceStart="00:00:13:360" duration="00:00:00:920" />
        </Sequence>

        {/* Subtitle chunk presents the next spoken phrase leading into the final qualifier. */}
        <Sequence from={ts('00:00:14:280')} durationInFrames={dur('00:00:01:160')}>
          <SubtitleChunk text="direct or even" sourceStart="00:00:14:280" duration="00:00:01:160" />
        </Sequence>

        {/* Subtitle chunk completes the definition with the final phrase before the outro. */}
        <Sequence from={ts('00:00:15:440')} durationInFrames={dur('00:00:00:900')}>
          <SubtitleChunk text="a little blunt" sourceStart="00:00:15:440" duration="00:00:00:900" />
        </Sequence>

        {/* Subtitle chunk starts the outro greeting in sync with the final clip. */}
        <Sequence from={ts('00:00:16:340')} durationInFrames={dur('00:00:00:940')}>
          <SubtitleChunk text="See you in" sourceStart="00:00:16:340" duration="00:00:00:940" />
        </Sequence>

        {/* Subtitle chunk closes the video with the last spoken words. */}
        <Sequence from={ts('00:00:17:280')} durationInFrames={dur('00:00:01:060')}>
          <SubtitleChunk text="the next video" sourceStart="00:00:17:280" duration="00:00:01:060" />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Word-of-the-day graphic appears just after the reveal starts to punch up the key term and sits above subtitles and video. */}
        <Sequence from={ts('00:00:09:500')} durationInFrames={dur('00:00:02:200')}>
          <LaconicReveal />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={dur('00:00:18:340')}
    fps={24}
    width={1080}
    height={1920}
  />
);

registerRoot(RemotionRoot);

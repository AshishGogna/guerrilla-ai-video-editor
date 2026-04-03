import React from 'react';
import {AbsoluteFill, Audio, Composition, OffthreadVideo, Sequence, staticFile, registerRoot, useCurrentFrame, spring} from 'remotion';

const FPS = 24;
const ts = (t: string) => { const [h, m, s, ms] = t.split(':').map(Number); return Math.round((h * 3600 + m * 60 + s + ms / 1000) * FPS); };

const palette = ['#00E5FF', '#B7FF00', '#FF3CAC', '#FFE600', '#FF7A00', '#9B5CFF', '#2979FF'];

const Word: React.FC<{
  text: string;
  start: string;
  end: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  active?: boolean;
  align?: 'left' | 'center' | 'right';
}> = ({text, start, x, y, fontSize, color, active = false, align = 'left'}) => {
  const frame = useCurrentFrame();
  const startFrame = ts(start);
  const localFrame = Math.max(0, frame - startFrame);
  const scale = spring({
    fps: FPS,
    frame: localFrame,
    config: {damping: 10, stiffness: 180, mass: 0.7},
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${0.85 + scale * 0.15})`,
        transformOrigin: 'center center',
        fontFamily: 'Arial Black, Impact, Helvetica, sans-serif',
        fontWeight: 900,
        fontSize,
        color: active ? color : '#FFFFFF',
        WebkitTextStroke: '8px #000000',
        paintOrder: 'stroke fill',
        textShadow: '0 8px 18px rgba(0,0,0,0.35)',
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
        textAlign: align,
        lineHeight: 0.9,
      }}
    >
      {text}
    </div>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <AbsoluteFill>
        {/* Track 1: Full-length muted trailer source used only to ensure continuous audio-track coverage across the timeline. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:33:000')}>
          <OffthreadVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('00:00:00:000')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0}}
          />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Track 2: Use the reviewer’s full synced audio continuously as the master narration and CTA track. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:33:000')}>
          <Audio src={staticFile('ashish.mp4')} startFrom={ts('00:00:00:000')} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Open on the reviewer on camera for the hook so the audience connects immediately with the recommendation and attitude. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:05:000')}>
          <OffthreadVideo
            src={staticFile('ashish.mp4')}
            startFrom={ts('00:00:00:000')}
            muted={false}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* Cut to trailer imagery matching the line about chaos, floating in space, and the absurd dog visual. */}
        <Sequence from={ts('00:00:05:000')} durationInFrames={ts('00:00:05:000')}>
          <OffthreadVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('00:00:05:000')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* Use the confrontation/action material that best supports the line about taking out rooms of goons in a neon-lit dive bar. */}
        <Sequence from={ts('00:00:10:000')} durationInFrames={ts('00:00:04:000')}>
          <OffthreadVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('00:01:24:000')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* Show the strongest explosive action beats to support the line about her being a total badass while everything around her explodes. */}
        <Sequence from={ts('00:00:14:000')} durationInFrames={ts('00:00:06:000')}>
          <OffthreadVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('00:02:00:000')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* Return to the reviewer for the heat-vision and confidence line so the personality of the speaker comes back into frame. */}
        <Sequence from={ts('00:00:20:000')} durationInFrames={ts('00:00:04:000')}>
          <OffthreadVideo
            src={staticFile('ashish.mp4')}
            startFrom={ts('00:00:20:000')}
            muted={false}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* Insert trailer imagery that best sells the heat-vision payoff and bridges toward the release-date mention. */}
        <Sequence from={ts('00:00:24:000')} durationInFrames={ts('00:00:03:000')}>
          <OffthreadVideo
            src={staticFile('trailer.mp4')}
            startFrom={ts('00:01:50:000')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {/* End on the reviewer for the theatrical date, share prompt, and final sign-off to camera. */}
        <Sequence from={ts('00:00:27:000')} durationInFrames={ts('00:00:06:000')}>
          <OffthreadVideo
            src={staticFile('ashish.mp4')}
            startFrom={ts('00:00:27:000')}
            muted={false}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Opening 5-word hook collage with extra-large sizing and bright color emphasis on the active spoken word. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:00:820')}><Word text="You" start="00:00:00:000" end="00:00:00:820" x={42} y={16} fontSize={92} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:00:820')} durationInFrames={ts('00:00:00:140')}><Word text="You" start="00:00:00:000" end="00:00:00:820" x={42} y={16} fontSize={92} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:00:820')} durationInFrames={ts('00:00:00:140')}><Word text="need" start="00:00:00:820" end="00:00:00:960" x={57} y={18} fontSize={88} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:00:960')} durationInFrames={ts('00:00:00:360')}><Word text="You" start="00:00:00:000" end="00:00:00:820" x={42} y={16} fontSize={92} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:00:960')} durationInFrames={ts('00:00:00:360')}><Word text="need" start="00:00:00:820" end="00:00:00:960" x={57} y={18} fontSize={88} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:00:960')} durationInFrames={ts('00:00:00:360')}><Word text="to" start="00:00:00:960" end="00:00:01:320" x={49} y={25} fontSize={80} color={palette[2]} active /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={1}><Word text="You" start="00:00:00:000" end="00:00:00:820" x={42} y={16} fontSize={92} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={1}><Word text="need" start="00:00:00:820" end="00:00:00:960" x={57} y={18} fontSize={88} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={1}><Word text="to" start="00:00:00:960" end="00:00:01:320" x={49} y={25} fontSize={80} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={1}><Word text="watch" start="00:00:01:320" end="00:00:01:320" x={62} y={27} fontSize={84} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={ts('00:00:00:460')}><Word text="You" start="00:00:00:000" end="00:00:00:820" x={42} y={16} fontSize={92} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={ts('00:00:00:460')}><Word text="need" start="00:00:00:820" end="00:00:00:960" x={57} y={18} fontSize={88} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={ts('00:00:00:460')}><Word text="to" start="00:00:00:960" end="00:00:01:320" x={49} y={25} fontSize={80} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={ts('00:00:00:460')}><Word text="watch" start="00:00:01:320" end="00:00:01:320" x={62} y={27} fontSize={84} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={ts('00:00:00:460')}><Word text="Supergirl" start="00:00:01:320" end="00:00:01:780" x={50} y={22} fontSize={132} color={palette[4]} active /></Sequence>

        {/* Second 5-word collage continuing the setup in the same general region with refreshed layout and stronger color pops. */}
        <Sequence from={ts('00:00:02:020')} durationInFrames={ts('00:00:00:240')}><Word text="because" start="00:00:02:020" end="00:00:02:260" x={43} y={18} fontSize={84} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:02:260')} durationInFrames={ts('00:00:00:420')}><Word text="because" start="00:00:02:020" end="00:00:02:260" x={43} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:02:260')} durationInFrames={ts('00:00:00:420')}><Word text="this" start="00:00:02:260" end="00:00:02:680" x={58} y={16} fontSize={82} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:02:680')} durationInFrames={ts('00:00:00:500')}><Word text="because" start="00:00:02:020" end="00:00:02:260" x={43} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:02:680')} durationInFrames={ts('00:00:00:500')}><Word text="this" start="00:00:02:260" end="00:00:02:680" x={58} y={16} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:02:680')} durationInFrames={ts('00:00:00:500')}><Word text="protagonist" start="00:00:02:680" end="00:00:03:180" x={51} y={24} fontSize={124} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:03:180')} durationInFrames={ts('00:00:00:280')}><Word text="because" start="00:00:02:020" end="00:00:02:260" x={43} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:03:180')} durationInFrames={ts('00:00:00:280')}><Word text="this" start="00:00:02:260" end="00:00:02:680" x={58} y={16} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:03:180')} durationInFrames={ts('00:00:00:280')}><Word text="protagonist" start="00:00:02:680" end="00:00:03:180" x={51} y={24} fontSize={124} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:03:180')} durationInFrames={ts('00:00:00:280')}><Word text="has" start="00:00:03:180" end="00:00:03:460" x={41} y={30} fontSize={78} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:03:460')} durationInFrames={ts('00:00:00:360')}><Word text="because" start="00:00:02:020" end="00:00:02:260" x={43} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:03:460')} durationInFrames={ts('00:00:00:360')}><Word text="this" start="00:00:02:260" end="00:00:02:680" x={58} y={16} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:03:460')} durationInFrames={ts('00:00:00:360')}><Word text="protagonist" start="00:00:02:680" end="00:00:03:180" x={51} y={24} fontSize={124} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:03:460')} durationInFrames={ts('00:00:00:360')}><Word text="has" start="00:00:03:180" end="00:00:03:460" x={41} y={30} fontSize={78} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:03:460')} durationInFrames={ts('00:00:00:360')}><Word text="a" start="00:00:03:460" end="00:00:03:820" x={61} y={29} fontSize={76} color={palette[2]} active /></Sequence>

        {/* Two-word emphasis collage for the attitude statement, with especially bold scaling. */}
        <Sequence from={ts('00:00:03:820')} durationInFrames={ts('00:00:00:420')}><Word text="major" start="00:00:03:820" end="00:00:04:240" x={44} y={19} fontSize={102} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:04:240')} durationInFrames={ts('00:00:00:620')}><Word text="major" start="00:00:03:820" end="00:00:04:240" x={44} y={19} fontSize={102} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:04:240')} durationInFrames={ts('00:00:00:620')}><Word text="attitude" start="00:00:04:240" end="00:00:04:860" x={53} y={27} fontSize={136} color={palette[4]} active /></Sequence>

        {/* New left-side collage position for the trailer-chaos line with more colorful active-word treatment. */}
        <Sequence from={ts('00:00:05:260')} durationInFrames={1}><Word text="The" start="00:00:05:260" end="00:00:05:280" x={24} y={22} fontSize={76} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:05:280')} durationInFrames={ts('00:00:00:080')}><Word text="The" start="00:00:05:260" end="00:00:05:280" x={24} y={22} fontSize={76} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:05:280')} durationInFrames={ts('00:00:00:080')}><Word text="trailer" start="00:00:05:280" end="00:00:05:360" x={36} y={18} fontSize={82} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:05:360')} durationInFrames={ts('00:00:00:340')}><Word text="The" start="00:00:05:260" end="00:00:05:280" x={24} y={22} fontSize={76} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:05:360')} durationInFrames={ts('00:00:00:340')}><Word text="trailer" start="00:00:05:280" end="00:00:05:360" x={36} y={18} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:05:360')} durationInFrames={ts('00:00:00:340')}><Word text="is" start="00:00:05:360" end="00:00:05:700" x={21} y={29} fontSize={74} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:05:700')} durationInFrames={ts('00:00:00:700')}><Word text="The" start="00:00:05:260" end="00:00:05:280" x={24} y={22} fontSize={76} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:05:700')} durationInFrames={ts('00:00:00:700')}><Word text="trailer" start="00:00:05:280" end="00:00:05:360" x={36} y={18} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:05:700')} durationInFrames={ts('00:00:00:700')}><Word text="is" start="00:00:05:360" end="00:00:05:700" x={21} y={29} fontSize={74} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:05:700')} durationInFrames={ts('00:00:00:700')}><Word text="absolute" start="00:00:05:700" end="00:00:06:400" x={33} y={26} fontSize={118} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:06:400')} durationInFrames={ts('00:00:00:420')}><Word text="The" start="00:00:05:260" end="00:00:05:280" x={24} y={22} fontSize={76} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:06:400')} durationInFrames={ts('00:00:00:420')}><Word text="trailer" start="00:00:05:280" end="00:00:05:360" x={36} y={18} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:06:400')} durationInFrames={ts('00:00:00:420')}><Word text="is" start="00:00:05:360" end="00:00:05:700" x={21} y={29} fontSize={74} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:06:400')} durationInFrames={ts('00:00:00:420')}><Word text="absolute" start="00:00:05:700" end="00:00:06:400" x={33} y={26} fontSize={118} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:06:400')} durationInFrames={ts('00:00:00:420')}><Word text="chaos" start="00:00:06:400" end="00:00:06:820" x={26} y={35} fontSize={122} color={palette[2]} active /></Sequence>

        {/* Floating-in-space phrase collage with enlarged key words and vivid color cycling. */}
        <Sequence from={ts('00:00:07:320')} durationInFrames={1}><Word text="showing" start="00:00:07:320" end="00:00:07:340" x={30} y={22} fontSize={78} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:07:340')} durationInFrames={ts('00:00:00:240')}><Word text="showing" start="00:00:07:320" end="00:00:07:340" x={30} y={22} fontSize={78} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:07:340')} durationInFrames={ts('00:00:00:240')}><Word text="her" start="00:00:07:340" end="00:00:07:580" x={18} y={30} fontSize={76} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:07:580')} durationInFrames={ts('00:00:00:580')}><Word text="showing" start="00:00:07:320" end="00:00:07:340" x={30} y={22} fontSize={78} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:07:580')} durationInFrames={ts('00:00:00:580')}><Word text="her" start="00:00:07:340" end="00:00:07:580" x={18} y={30} fontSize={76} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:07:580')} durationInFrames={ts('00:00:00:580')}><Word text="literally" start="00:00:07:580" end="00:00:08:160" x={35} y={31} fontSize={114} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:08:160')} durationInFrames={ts('00:00:00:340')}><Word text="showing" start="00:00:07:320" end="00:00:07:340" x={30} y={22} fontSize={78} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:08:160')} durationInFrames={ts('00:00:00:340')}><Word text="her" start="00:00:07:340" end="00:00:07:580" x={18} y={30} fontSize={76} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:08:160')} durationInFrames={ts('00:00:00:340')}><Word text="literally" start="00:00:07:580" end="00:00:08:160" x={35} y={31} fontSize={114} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:08:160')} durationInFrames={ts('00:00:00:340')}><Word text="floating" start="00:00:08:160" end="00:00:08:500" x={28} y={40} fontSize={120} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:08:500')} durationInFrames={ts('00:00:00:460')}><Word text="showing" start="00:00:07:320" end="00:00:07:340" x={30} y={22} fontSize={78} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:08:500')} durationInFrames={ts('00:00:00:460')}><Word text="her" start="00:00:07:340" end="00:00:07:580" x={18} y={30} fontSize={76} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:08:500')} durationInFrames={ts('00:00:00:460')}><Word text="literally" start="00:00:07:580" end="00:00:08:160" x={35} y={31} fontSize={114} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:08:500')} durationInFrames={ts('00:00:00:460')}><Word text="floating" start="00:00:08:160" end="00:00:08:500" x={28} y={40} fontSize={120} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:08:500')} durationInFrames={ts('00:00:00:460')}><Word text="in" start="00:00:08:500" end="00:00:08:960" x={18} y={40} fontSize={72} color={palette[0]} active /></Sequence>

        {/* Space-with-a-dog payoff collage, centered and punchy. */}
        <Sequence from={ts('00:00:08:960')} durationInFrames={ts('00:00:00:240')}><Word text="space" start="00:00:08:960" end="00:00:09:200" x={46} y={32} fontSize={118} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:09:200')} durationInFrames={ts('00:00:00:240')}><Word text="space" start="00:00:08:960" end="00:00:09:200" x={46} y={32} fontSize={118} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:09:200')} durationInFrames={ts('00:00:00:240')}><Word text="with" start="00:00:09:200" end="00:00:09:440" x={57} y={39} fontSize={78} color={palette[2]} active /></Sequence>
        <Sequence from={ts('00:00:09:440')} durationInFrames={ts('00:00:00:480')}><Word text="space" start="00:00:08:960" end="00:00:09:200" x={46} y={32} fontSize={118} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:09:440')} durationInFrames={ts('00:00:00:480')}><Word text="with" start="00:00:09:200" end="00:00:09:440" x={57} y={39} fontSize={78} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:09:440')} durationInFrames={ts('00:00:00:480')}><Word text="a" start="00:00:09:440" end="00:00:09:920" x={44} y={43} fontSize={70} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:09:920')} durationInFrames={1}><Word text="space" start="00:00:08:960" end="00:00:09:200" x={46} y={32} fontSize={118} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:09:920')} durationInFrames={1}><Word text="with" start="00:00:09:200" end="00:00:09:440" x={57} y={39} fontSize={78} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:09:920')} durationInFrames={1}><Word text="a" start="00:00:09:440" end="00:00:09:920" x={44} y={43} fontSize={70} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:09:920')} durationInFrames={1}><Word text="dog" start="00:00:09:920" end="00:00:09:920" x={58} y={28} fontSize={124} color={palette[4]} active /></Sequence>

        {/* Lower-middle action collage for the goons line with strong oversized emphasis. */}
        <Sequence from={ts('00:00:10:080')} durationInFrames={ts('00:00:00:220')}><Word text="taking" start="00:00:10:080" end="00:00:10:300" x={44} y={70} fontSize={84} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:10:300')} durationInFrames={ts('00:00:00:400')}><Word text="taking" start="00:00:10:080" end="00:00:10:300" x={44} y={70} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:10:300')} durationInFrames={ts('00:00:00:400')}><Word text="out" start="00:00:10:300" end="00:00:10:700" x={60} y={67} fontSize={82} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:10:700')} durationInFrames={ts('00:00:00:660')}><Word text="taking" start="00:00:10:080" end="00:00:10:300" x={44} y={70} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:10:700')} durationInFrames={ts('00:00:00:660')}><Word text="out" start="00:00:10:300" end="00:00:10:700" x={60} y={67} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:10:700')} durationInFrames={ts('00:00:00:660')}><Word text="entire" start="00:00:10:700" end="00:00:11:360" x={38} y={79} fontSize={122} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:11:360')} durationInFrames={ts('00:00:00:440')}><Word text="taking" start="00:00:10:080" end="00:00:10:300" x={44} y={70} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:11:360')} durationInFrames={ts('00:00:00:440')}><Word text="out" start="00:00:10:300" end="00:00:10:700" x={60} y={67} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:11:360')} durationInFrames={ts('00:00:00:440')}><Word text="entire" start="00:00:10:700" end="00:00:11:360" x={38} y={79} fontSize={122} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:11:360')} durationInFrames={ts('00:00:00:440')}><Word text="rooms" start="00:00:11:360" end="00:00:11:800" x={58} y={80} fontSize={126} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:11:800')} durationInFrames={ts('00:00:00:740')}><Word text="taking" start="00:00:10:080" end="00:00:10:300" x={44} y={70} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:11:800')} durationInFrames={ts('00:00:00:740')}><Word text="out" start="00:00:10:300" end="00:00:10:700" x={60} y={67} fontSize={82} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:11:800')} durationInFrames={ts('00:00:00:740')}><Word text="entire" start="00:00:10:700" end="00:00:11:360" x={38} y={79} fontSize={122} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:11:800')} durationInFrames={ts('00:00:00:740')}><Word text="rooms" start="00:00:11:360" end="00:00:11:800" x={58} y={80} fontSize={126} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:11:800')} durationInFrames={ts('00:00:00:740')}><Word text="of" start="00:00:11:800" end="00:00:12:540" x={50} y={88} fontSize={72} color={palette[2]} active /></Sequence>

        {/* Continuation collage for the neon-lit dive-bar phrase in the same lower-middle region. */}
        <Sequence from={ts('00:00:12:540')} durationInFrames={1}><Word text="goons" start="00:00:12:540" end="00:00:12:540" x={43} y={74} fontSize={116} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:12:540')} durationInFrames={ts('00:00:00:240')}><Word text="goons" start="00:00:12:540" end="00:00:12:540" x={43} y={74} fontSize={116} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:12:540')} durationInFrames={ts('00:00:00:240')}><Word text="in" start="00:00:12:540" end="00:00:12:780" x={58} y={74} fontSize={70} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:12:780')} durationInFrames={ts('00:00:00:300')}><Word text="goons" start="00:00:12:540" end="00:00:12:540" x={43} y={74} fontSize={116} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:12:780')} durationInFrames={ts('00:00:00:300')}><Word text="in" start="00:00:12:540" end="00:00:12:780" x={58} y={74} fontSize={70} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:12:780')} durationInFrames={ts('00:00:00:300')}><Word text="a" start="00:00:12:780" end="00:00:13:080" x={63} y={81} fontSize={68} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:13:080')} durationInFrames={ts('00:00:00:260')}><Word text="goons" start="00:00:12:540" end="00:00:12:540" x={43} y={74} fontSize={116} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:13:080')} durationInFrames={ts('00:00:00:260')}><Word text="in" start="00:00:12:540" end="00:00:12:780" x={58} y={74} fontSize={70} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:13:080')} durationInFrames={ts('00:00:00:260')}><Word text="a" start="00:00:12:780" end="00:00:13:080" x={63} y={81} fontSize={68} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:13:080')} durationInFrames={ts('00:00:00:260')}><Word text="neon" start="00:00:13:080" end="00:00:13:340" x={47} y={84} fontSize={118} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:13:340')} durationInFrames={ts('00:00:00:300')}><Word text="goons" start="00:00:12:540" end="00:00:12:540" x={43} y={74} fontSize={116} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:13:340')} durationInFrames={ts('00:00:00:300')}><Word text="in" start="00:00:12:540" end="00:00:12:780" x={58} y={74} fontSize={70} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:13:340')} durationInFrames={ts('00:00:00:300')}><Word text="a" start="00:00:12:780" end="00:00:13:080" x={63} y={81} fontSize={68} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:13:340')} durationInFrames={ts('00:00:00:300')}><Word text="neon" start="00:00:13:080" end="00:00:13:340" x={47} y={84} fontSize={118} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:13:340')} durationInFrames={ts('00:00:00:300')}><Word text="lit" start="00:00:13:340" end="00:00:13:640" x={61} y={86} fontSize={82} color={palette[0]} active /></Sequence>

        {/* Short “dive bar” emphasis cluster with large stacked typography. */}
        <Sequence from={ts('00:00:13:640')} durationInFrames={ts('00:00:00:360')}><Word text="dive" start="00:00:13:640" end="00:00:14:000" x={46} y={78} fontSize={108} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:14:000')} durationInFrames={ts('00:00:00:340')}><Word text="dive" start="00:00:13:640" end="00:00:14:000" x={46} y={78} fontSize={108} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:14:000')} durationInFrames={ts('00:00:00:340')}><Word text="bar" start="00:00:14:000" end="00:00:14:340" x={55} y={86} fontSize={118} color={palette[2]} active /></Sequence>

        {/* Center-right collage for the badass setup with larger colorful motion treatment. */}
        <Sequence from={ts('00:00:15:220')} durationInFrames={ts('00:00:00:600')}><Word text="and" start="00:00:15:220" end="00:00:15:820" x={75} y={28} fontSize={74} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:15:820')} durationInFrames={ts('00:00:00:440')}><Word text="and" start="00:00:15:220" end="00:00:15:820" x={75} y={28} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:15:820')} durationInFrames={ts('00:00:00:440')}><Word text="basically" start="00:00:15:820" end="00:00:16:260" x={69} y={36} fontSize={116} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:16:260')} durationInFrames={ts('00:00:00:380')}><Word text="and" start="00:00:15:220" end="00:00:15:820" x={75} y={28} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:16:260')} durationInFrames={ts('00:00:00:380')}><Word text="basically" start="00:00:15:820" end="00:00:16:260" x={69} y={36} fontSize={116} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:16:260')} durationInFrames={ts('00:00:00:380')}><Word text="being" start="00:00:16:260" end="00:00:16:640" x={81} y={44} fontSize={88} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:16:640')} durationInFrames={ts('00:00:00:260')}><Word text="and" start="00:00:15:220" end="00:00:15:820" x={75} y={28} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:16:640')} durationInFrames={ts('00:00:00:260')}><Word text="basically" start="00:00:15:820" end="00:00:16:260" x={69} y={36} fontSize={116} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:16:640')} durationInFrames={ts('00:00:00:260')}><Word text="being" start="00:00:16:260" end="00:00:16:640" x={81} y={44} fontSize={88} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:16:640')} durationInFrames={ts('00:00:00:260')}><Word text="a" start="00:00:16:640" end="00:00:16:900" x={67} y={47} fontSize={68} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:16:900')} durationInFrames={ts('00:00:00:520')}><Word text="and" start="00:00:15:220" end="00:00:15:820" x={75} y={28} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:16:900')} durationInFrames={ts('00:00:00:520')}><Word text="basically" start="00:00:15:820" end="00:00:16:260" x={69} y={36} fontSize={116} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:16:900')} durationInFrames={ts('00:00:00:520')}><Word text="being" start="00:00:16:260" end="00:00:16:640" x={81} y={44} fontSize={88} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:16:900')} durationInFrames={ts('00:00:00:520')}><Word text="a" start="00:00:16:640" end="00:00:16:900" x={67} y={47} fontSize={68} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:16:900')} durationInFrames={ts('00:00:00:520')}><Word text="total" start="00:00:16:900" end="00:00:17:420" x={76} y={53} fontSize={120} color={palette[0]} active /></Sequence>

        {/* Explosion statement collage with “badass” as the hero word and strong color emphasis. */}
        <Sequence from={ts('00:00:17:420')} durationInFrames={ts('00:00:00:420')}><Word text="badass" start="00:00:17:420" end="00:00:17:840" x={74} y={36} fontSize={132} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:17:840')} durationInFrames={ts('00:00:00:420')}><Word text="badass" start="00:00:17:420" end="00:00:17:840" x={74} y={36} fontSize={132} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:17:840')} durationInFrames={ts('00:00:00:420')}><Word text="while" start="00:00:17:840" end="00:00:18:260" x={83} y={46} fontSize={84} color={palette[2]} active /></Sequence>
        <Sequence from={ts('00:00:18:260')} durationInFrames={ts('00:00:00:480')}><Word text="badass" start="00:00:17:420" end="00:00:17:840" x={74} y={36} fontSize={132} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:18:260')} durationInFrames={ts('00:00:00:480')}><Word text="while" start="00:00:17:840" end="00:00:18:260" x={83} y={46} fontSize={84} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:18:260')} durationInFrames={ts('00:00:00:480')}><Word text="everything" start="00:00:18:260" end="00:00:18:740" x={71} y={55} fontSize={108} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:18:740')} durationInFrames={ts('00:00:00:340')}><Word text="badass" start="00:00:17:420" end="00:00:17:840" x={74} y={36} fontSize={132} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:18:740')} durationInFrames={ts('00:00:00:340')}><Word text="while" start="00:00:17:840" end="00:00:18:260" x={83} y={46} fontSize={84} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:18:740')} durationInFrames={ts('00:00:00:340')}><Word text="everything" start="00:00:18:260" end="00:00:18:740" x={71} y={55} fontSize={108} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:18:740')} durationInFrames={ts('00:00:00:340')}><Word text="around" start="00:00:18:740" end="00:00:19:080" x={83} y={64} fontSize={86} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:19:080')} durationInFrames={ts('00:00:00:540')}><Word text="badass" start="00:00:17:420" end="00:00:17:840" x={74} y={36} fontSize={132} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:19:080')} durationInFrames={ts('00:00:00:540')}><Word text="while" start="00:00:17:840" end="00:00:18:260" x={83} y={46} fontSize={84} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:19:080')} durationInFrames={ts('00:00:00:540')}><Word text="everything" start="00:00:18:260" end="00:00:18:740" x={71} y={55} fontSize={108} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:19:080')} durationInFrames={ts('00:00:00:540')}><Word text="around" start="00:00:18:740" end="00:00:19:080" x={83} y={64} fontSize={86} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:19:080')} durationInFrames={ts('00:00:00:540')}><Word text="her" start="00:00:19:080" end="00:00:19:620" x={69} y={67} fontSize={76} color={palette[5]} active /></Sequence>

        {/* Single-word impact graphic for “explodes,” using the most dramatic color and scale hit in the sequence. */}
        <Sequence from={ts('00:00:19:620')} durationInFrames={ts('00:00:00:460')}><Word text="explodes" start="00:00:19:620" end="00:00:20:080" x={50} y={50} fontSize={156} color={palette[6]} active /></Sequence>

        {/* Fresh left-side collage for the reviewer return and heat-vision setup. */}
        <Sequence from={ts('00:00:20:300')} durationInFrames={ts('00:00:00:180')}><Word text="You" start="00:00:20:300" end="00:00:20:480" x={22} y={66} fontSize={82} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:20:480')} durationInFrames={ts('00:00:00:160')}><Word text="You" start="00:00:20:300" end="00:00:20:480" x={22} y={66} fontSize={82} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:20:480')} durationInFrames={ts('00:00:00:160')}><Word text="can" start="00:00:20:480" end="00:00:20:640" x={34} y={62} fontSize={78} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:20:640')} durationInFrames={ts('00:00:00:220')}><Word text="You" start="00:00:20:300" end="00:00:20:480" x={22} y={66} fontSize={82} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:20:640')} durationInFrames={ts('00:00:00:220')}><Word text="can" start="00:00:20:480" end="00:00:20:640" x={34} y={62} fontSize={78} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:20:640')} durationInFrames={ts('00:00:00:220')}><Word text="even" start="00:00:20:640" end="00:00:20:860" x={27} y={73} fontSize={80} color={palette[2]} active /></Sequence>
        <Sequence from={ts('00:00:20:860')} durationInFrames={ts('00:00:00:120')}><Word text="You" start="00:00:20:300" end="00:00:20:480" x={22} y={66} fontSize={82} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:20:860')} durationInFrames={ts('00:00:00:120')}><Word text="can" start="00:00:20:480" end="00:00:20:640" x={34} y={62} fontSize={78} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:20:860')} durationInFrames={ts('00:00:00:120')}><Word text="even" start="00:00:20:640" end="00:00:20:860" x={27} y={73} fontSize={80} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:20:860')} durationInFrames={ts('00:00:00:120')}><Word text="see" start="00:00:20:860" end="00:00:20:980" x={39} y={71} fontSize={78} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:20:980')} durationInFrames={ts('00:00:00:200')}><Word text="You" start="00:00:20:300" end="00:00:20:480" x={22} y={66} fontSize={82} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:20:980')} durationInFrames={ts('00:00:00:200')}><Word text="can" start="00:00:20:480" end="00:00:20:640" x={34} y={62} fontSize={78} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:20:980')} durationInFrames={ts('00:00:00:200')}><Word text="even" start="00:00:20:640" end="00:00:20:860" x={27} y={73} fontSize={80} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:20:980')} durationInFrames={ts('00:00:00:200')}><Word text="see" start="00:00:20:860" end="00:00:20:980" x={39} y={71} fontSize={78} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:20:980')} durationInFrames={ts('00:00:00:200')}><Word text="her" start="00:00:20:980" end="00:00:21:180" x={24} y={81} fontSize={76} color={palette[4]} active /></Sequence>

        {/* Heat-vision collage with dominant treatment on the phrase itself. */}
        <Sequence from={ts('00:00:21:180')} durationInFrames={ts('00:00:00:300')}><Word text="heat" start="00:00:21:180" end="00:00:21:480" x={25} y={68} fontSize={120} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:21:480')} durationInFrames={ts('00:00:00:280')}><Word text="heat" start="00:00:21:180" end="00:00:21:480" x={25} y={68} fontSize={120} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:21:480')} durationInFrames={ts('00:00:00:280')}><Word text="vision" start="00:00:21:480" end="00:00:21:760" x={35} y={77} fontSize={126} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:22:020')} durationInFrames={ts('00:00:00:180')}><Word text="heat" start="00:00:21:180" end="00:00:21:480" x={25} y={68} fontSize={120} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:22:020')} durationInFrames={ts('00:00:00:180')}><Word text="vision" start="00:00:21:480" end="00:00:21:760" x={35} y={77} fontSize={126} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:22:020')} durationInFrames={ts('00:00:00:180')}><Word text="melting" start="00:00:22:020" end="00:00:22:200" x={24} y={86} fontSize={84} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:22:200')} durationInFrames={ts('00:00:00:480')}><Word text="heat" start="00:00:21:180" end="00:00:21:480" x={25} y={68} fontSize={120} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:22:200')} durationInFrames={ts('00:00:00:480')}><Word text="vision" start="00:00:21:480" end="00:00:21:760" x={35} y={77} fontSize={126} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:22:200')} durationInFrames={ts('00:00:00:480')}><Word text="melting" start="00:00:22:020" end="00:00:22:200" x={24} y={86} fontSize={84} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:22:200')} durationInFrames={ts('00:00:00:480')}><Word text="faces" start="00:00:22:200" end="00:00:22:680" x={38} y={87} fontSize={90} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:22:680')} durationInFrames={ts('00:00:00:240')}><Word text="heat" start="00:00:21:180" end="00:00:21:480" x={25} y={68} fontSize={120} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:22:680')} durationInFrames={ts('00:00:00:240')}><Word text="vision" start="00:00:21:480" end="00:00:21:760" x={35} y={77} fontSize={126} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:22:680')} durationInFrames={ts('00:00:00:240')}><Word text="melting" start="00:00:22:020" end="00:00:22:200" x={24} y={86} fontSize={84} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:22:680')} durationInFrames={ts('00:00:00:240')}><Word text="faces" start="00:00:22:200" end="00:00:22:680" x={38} y={87} fontSize={90} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:22:680')} durationInFrames={ts('00:00:00:240')}><Word text="and" start="00:00:22:680" end="00:00:22:920" x={20} y={90} fontSize={72} color={palette[2]} active /></Sequence>

        {/* First half of the “not giving a single” phrase in a compact oversized batch. */}
        <Sequence from={ts('00:00:22:920')} durationInFrames={ts('00:00:00:180')}><Word text="her" start="00:00:22:920" end="00:00:23:100" x={26} y={70} fontSize={74} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:23:100')} durationInFrames={ts('00:00:00:260')}><Word text="her" start="00:00:22:920" end="00:00:23:100" x={26} y={70} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:23:100')} durationInFrames={ts('00:00:00:260')}><Word text="just" start="00:00:23:100" end="00:00:23:360" x={38} y={66} fontSize={82} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:23:360')} durationInFrames={ts('00:00:00:200')}><Word text="her" start="00:00:22:920" end="00:00:23:100" x={26} y={70} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:23:360')} durationInFrames={ts('00:00:00:200')}><Word text="just" start="00:00:23:100" end="00:00:23:360" x={38} y={66} fontSize={82} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:23:360')} durationInFrames={ts('00:00:00:200')}><Word text="not" start="00:00:23:360" end="00:00:23:560" x={25} y={78} fontSize={90} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:23:560')} durationInFrames={ts('00:00:00:260')}><Word text="her" start="00:00:22:920" end="00:00:23:100" x={26} y={70} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:23:560')} durationInFrames={ts('00:00:00:260')}><Word text="just" start="00:00:23:100" end="00:00:23:360" x={38} y={66} fontSize={82} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:23:560')} durationInFrames={ts('00:00:00:260')}><Word text="not" start="00:00:23:360" end="00:00:23:560" x={25} y={78} fontSize={90} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:23:560')} durationInFrames={ts('00:00:00:260')}><Word text="giving" start="00:00:23:560" end="00:00:23:820" x={40} y={81} fontSize={100} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:23:820')} durationInFrames={ts('00:00:00:140')}><Word text="her" start="00:00:22:920" end="00:00:23:100" x={26} y={70} fontSize={74} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:23:820')} durationInFrames={ts('00:00:00:140')}><Word text="just" start="00:00:23:100" end="00:00:23:360" x={38} y={66} fontSize={82} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:23:820')} durationInFrames={ts('00:00:00:140')}><Word text="not" start="00:00:23:360" end="00:00:23:560" x={25} y={78} fontSize={90} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:23:820')} durationInFrames={ts('00:00:00:140')}><Word text="giving" start="00:00:23:560" end="00:00:23:820" x={40} y={81} fontSize={100} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:23:820')} durationInFrames={ts('00:00:00:140')}><Word text="a" start="00:00:23:820" end="00:00:23:960" x={22} y={87} fontSize={66} color={palette[0]} active /></Sequence>

        {/* Mini-batch remainder with extra emphasis on “damn.” */}
        <Sequence from={ts('00:00:23:960')} durationInFrames={ts('00:00:00:360')}><Word text="single" start="00:00:23:960" end="00:00:24:320" x={34} y={74} fontSize={92} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:24:320')} durationInFrames={ts('00:00:00:220')}><Word text="single" start="00:00:23:960" end="00:00:24:320" x={34} y={74} fontSize={92} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:24:320')} durationInFrames={ts('00:00:00:220')}><Word text="damn" start="00:00:24:320" end="00:00:24:540" x={28} y={84} fontSize={128} color={palette[2]} active /></Sequence>

        {/* Upper-right release-info setup collage with bright promotional feel. */}
        <Sequence from={ts('00:00:24:660')} durationInFrames={ts('00:00:00:140')}><Word text="You" start="00:00:24:660" end="00:00:24:800" x={76} y={18} fontSize={82} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:24:800')} durationInFrames={ts('00:00:00:160')}><Word text="You" start="00:00:24:660" end="00:00:24:800" x={76} y={18} fontSize={82} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:24:800')} durationInFrames={ts('00:00:00:160')}><Word text="can" start="00:00:24:800" end="00:00:24:960" x={86} y={24} fontSize={78} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:24:960')} durationInFrames={ts('00:00:00:180')}><Word text="You" start="00:00:24:660" end="00:00:24:800" x={76} y={18} fontSize={82} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:24:960')} durationInFrames={ts('00:00:00:180')}><Word text="can" start="00:00:24:800" end="00:00:24:960" x={86} y={24} fontSize={78} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:24:960')} durationInFrames={ts('00:00:00:180')}><Word text="watch" start="00:00:24:960" end="00:00:25:140" x={75} y={29} fontSize={108} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:25:140')} durationInFrames={ts('00:00:00:120')}><Word text="You" start="00:00:24:660" end="00:00:24:800" x={76} y={18} fontSize={82} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:25:140')} durationInFrames={ts('00:00:00:120')}><Word text="can" start="00:00:24:800" end="00:00:24:960" x={86} y={24} fontSize={78} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:25:140')} durationInFrames={ts('00:00:00:120')}><Word text="watch" start="00:00:24:960" end="00:00:25:140" x={75} y={29} fontSize={108} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:25:140')} durationInFrames={ts('00:00:00:120')}><Word text="it" start="00:00:25:140" end="00:00:25:260" x={88} y={33} fontSize={72} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:25:260')} durationInFrames={ts('00:00:00:420')}><Word text="You" start="00:00:24:660" end="00:00:24:800" x={76} y={18} fontSize={82} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:25:260')} durationInFrames={ts('00:00:00:420')}><Word text="can" start="00:00:24:800" end="00:00:24:960" x={86} y={24} fontSize={78} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:25:260')} durationInFrames={ts('00:00:00:420')}><Word text="watch" start="00:00:24:960" end="00:00:25:140" x={75} y={29} fontSize={108} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:25:260')} durationInFrames={ts('00:00:00:420')}><Word text="it" start="00:00:25:140" end="00:00:25:260" x={88} y={33} fontSize={72} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:25:260')} durationInFrames={ts('00:00:00:420')}><Word text="in" start="00:00:25:260" end="00:00:25:680" x={81} y={38} fontSize={70} color={palette[0]} active /></Sequence>

        {/* Date-emphasis collage highlighting the theatrical release with bigger color accents. */}
        <Sequence from={ts('00:00:25:680')} durationInFrames={ts('00:00:00:100')}><Word text="theatres" start="00:00:25:680" end="00:00:25:780" x={78} y={22} fontSize={88} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:25:780')} durationInFrames={ts('00:00:00:400')}><Word text="theatres" start="00:00:25:680" end="00:00:25:780" x={78} y={22} fontSize={88} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:25:780')} durationInFrames={ts('00:00:00:400')}><Word text="starting" start="00:00:25:780" end="00:00:26:180" x={72} y={31} fontSize={84} color={palette[2]} active /></Sequence>
        <Sequence from={ts('00:00:26:180')} durationInFrames={ts('00:00:00:380')}><Word text="theatres" start="00:00:25:680" end="00:00:25:780" x={78} y={22} fontSize={88} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:26:180')} durationInFrames={ts('00:00:00:380')}><Word text="starting" start="00:00:25:780" end="00:00:26:180" x={72} y={31} fontSize={84} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:26:180')} durationInFrames={ts('00:00:00:380')}><Word text="June" start="00:00:26:180" end="00:00:26:560" x={81} y={42} fontSize={126} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:26:560')} durationInFrames={ts('00:00:00:880')}><Word text="theatres" start="00:00:25:680" end="00:00:25:780" x={78} y={22} fontSize={88} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:26:560')} durationInFrames={ts('00:00:00:880')}><Word text="starting" start="00:00:25:780" end="00:00:26:180" x={72} y={31} fontSize={84} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:26:560')} durationInFrames={ts('00:00:00:880')}><Word text="June" start="00:00:26:180" end="00:00:26:560" x={81} y={42} fontSize={126} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:26:560')} durationInFrames={ts('00:00:00:880')}><Word text="26th" start="00:00:26:560" end="00:00:27:440" x={74} y={53} fontSize={132} color={palette[4]} active /></Sequence>

        {/* CTA opening collage with extra emphasis on the share action. */}
        <Sequence from={ts('00:00:27:440')} durationInFrames={ts('00:00:00:300')}><Word text="Do" start="00:00:27:440" end="00:00:27:740" x={28} y={18} fontSize={84} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:27:740')} durationInFrames={ts('00:00:00:260')}><Word text="Do" start="00:00:27:440" end="00:00:27:740" x={28} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:27:740')} durationInFrames={ts('00:00:00:260')}><Word text="share" start="00:00:27:740" end="00:00:28:000" x={38} y={26} fontSize={124} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:28:000')} durationInFrames={ts('00:00:00:260')}><Word text="Do" start="00:00:27:440" end="00:00:27:740" x={28} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:28:000')} durationInFrames={ts('00:00:00:260')}><Word text="share" start="00:00:27:740" end="00:00:28:000" x={38} y={26} fontSize={124} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:28:000')} durationInFrames={ts('00:00:00:260')}><Word text="this" start="00:00:28:000" end="00:00:28:260" x={26} y={33} fontSize={82} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:28:260')} durationInFrames={ts('00:00:00:100')}><Word text="Do" start="00:00:27:440" end="00:00:27:740" x={28} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:28:260')} durationInFrames={ts('00:00:00:100')}><Word text="share" start="00:00:27:740" end="00:00:28:000" x={38} y={26} fontSize={124} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:28:260')} durationInFrames={ts('00:00:00:100')}><Word text="this" start="00:00:28:000" end="00:00:28:260" x={26} y={33} fontSize={82} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:28:260')} durationInFrames={ts('00:00:00:100')}><Word text="with" start="00:00:28:260" end="00:00:28:360" x={41} y={37} fontSize={76} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:28:360')} durationInFrames={ts('00:00:00:420')}><Word text="Do" start="00:00:27:440" end="00:00:27:740" x={28} y={18} fontSize={84} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:28:360')} durationInFrames={ts('00:00:00:420')}><Word text="share" start="00:00:27:740" end="00:00:28:000" x={38} y={26} fontSize={124} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:28:360')} durationInFrames={ts('00:00:00:420')}><Word text="this" start="00:00:28:000" end="00:00:28:260" x={26} y={33} fontSize={82} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:28:360')} durationInFrames={ts('00:00:00:420')}><Word text="with" start="00:00:28:260" end="00:00:28:360" x={41} y={37} fontSize={76} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:28:360')} durationInFrames={ts('00:00:00:420')}><Word text="a" start="00:00:28:360" end="00:00:28:780" x={21} y={41} fontSize={68} color={palette[2]} active /></Sequence>

        {/* Friend/take-with-you collage with “friend” as the visual anchor. */}
        <Sequence from={ts('00:00:28:780')} durationInFrames={1}><Word text="friend" start="00:00:28:780" end="00:00:28:780" x={29} y={24} fontSize={122} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:28:780')} durationInFrames={ts('00:00:00:140')}><Word text="friend" start="00:00:28:780" end="00:00:28:780" x={29} y={24} fontSize={122} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:28:780')} durationInFrames={ts('00:00:00:140')}><Word text="you" start="00:00:28:780" end="00:00:28:920" x={42} y={30} fontSize={80} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:28:920')} durationInFrames={ts('00:00:00:240')}><Word text="friend" start="00:00:28:780" end="00:00:28:780" x={29} y={24} fontSize={122} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:28:920')} durationInFrames={ts('00:00:00:240')}><Word text="you" start="00:00:28:780" end="00:00:28:920" x={42} y={30} fontSize={80} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:28:920')} durationInFrames={ts('00:00:00:240')}><Word text="wanna" start="00:00:28:920" end="00:00:29:160" x={28} y={36} fontSize={86} color={palette[5]} active /></Sequence>
        <Sequence from={ts('00:00:29:160')} durationInFrames={ts('00:00:00:400')}><Word text="friend" start="00:00:28:780" end="00:00:28:780" x={29} y={24} fontSize={122} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:29:160')} durationInFrames={ts('00:00:00:400')}><Word text="you" start="00:00:28:780" end="00:00:28:920" x={42} y={30} fontSize={80} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:29:160')} durationInFrames={ts('00:00:00:400')}><Word text="wanna" start="00:00:28:920" end="00:00:29:160" x={28} y={36} fontSize={86} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:29:160')} durationInFrames={ts('00:00:00:400')}><Word text="take" start="00:00:29:160" end="00:00:29:560" x={41} y={42} fontSize={92} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:29:560')} durationInFrames={ts('00:00:00:240')}><Word text="friend" start="00:00:28:780" end="00:00:28:780" x={29} y={24} fontSize={122} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:29:560')} durationInFrames={ts('00:00:00:240')}><Word text="you" start="00:00:28:780" end="00:00:28:920" x={42} y={30} fontSize={80} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:29:560')} durationInFrames={ts('00:00:00:240')}><Word text="wanna" start="00:00:28:920" end="00:00:29:160" x={28} y={36} fontSize={86} color={palette[5]} /></Sequence>
        <Sequence from={ts('00:00:29:560')} durationInFrames={ts('00:00:00:240')}><Word text="take" start="00:00:29:160" end="00:00:29:560" x={41} y={42} fontSize={92} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:29:560')} durationInFrames={ts('00:00:00:240')}><Word text="with" start="00:00:29:560" end="00:00:29:800" x={29} y={47} fontSize={74} color={palette[0]} active /></Sequence>

        {/* Final sentence first batch in a centered closing position with strong colorful live-word emphasis. */}
        <Sequence from={ts('00:00:29:800')} durationInFrames={ts('00:00:00:220')}><Word text="you" start="00:00:29:800" end="00:00:30:020" x={49} y={18} fontSize={82} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:30:480')} durationInFrames={ts('00:00:00:080')}><Word text="you" start="00:00:29:800" end="00:00:30:020" x={49} y={18} fontSize={82} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:30:480')} durationInFrames={ts('00:00:00:080')}><Word text="and" start="00:00:30:480" end="00:00:30:560" x={60} y={22} fontSize={74} color={palette[2]} active /></Sequence>
        <Sequence from={ts('00:00:30:560')} durationInFrames={ts('00:00:00:300')}><Word text="you" start="00:00:29:800" end="00:00:30:020" x={49} y={18} fontSize={82} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:30:560')} durationInFrames={ts('00:00:00:300')}><Word text="and" start="00:00:30:480" end="00:00:30:560" x={60} y={22} fontSize={74} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:30:560')} durationInFrames={ts('00:00:00:300')}><Word text="I’ll" start="00:00:30:560" end="00:00:30:860" x={45} y={27} fontSize={94} color={palette[3]} active /></Sequence>
        <Sequence from={ts('00:00:30:860')} durationInFrames={ts('00:00:00:200')}><Word text="you" start="00:00:29:800" end="00:00:30:020" x={49} y={18} fontSize={82} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:30:860')} durationInFrames={ts('00:00:00:200')}><Word text="and" start="00:00:30:480" end="00:00:30:560" x={60} y={22} fontSize={74} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:30:860')} durationInFrames={ts('00:00:00:200')}><Word text="I’ll" start="00:00:30:560" end="00:00:30:860" x={45} y={27} fontSize={94} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:30:860')} durationInFrames={ts('00:00:00:200')}><Word text="see" start="00:00:30:860" end="00:00:31:060" x={57} y={30} fontSize={86} color={palette[4]} active /></Sequence>
        <Sequence from={ts('00:00:31:060')} durationInFrames={ts('00:00:00:400')}><Word text="you" start="00:00:29:800" end="00:00:30:020" x={49} y={18} fontSize={82} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:31:060')} durationInFrames={ts('00:00:00:400')}><Word text="and" start="00:00:30:480" end="00:00:30:560" x={60} y={22} fontSize={74} color={palette[2]} /></Sequence>
        <Sequence from={ts('00:00:31:060')} durationInFrames={ts('00:00:00:400')}><Word text="I’ll" start="00:00:30:560" end="00:00:30:860" x={45} y={27} fontSize={94} color={palette[3]} /></Sequence>
        <Sequence from={ts('00:00:31:060')} durationInFrames={ts('00:00:00:400')}><Word text="see" start="00:00:30:860" end="00:00:31:060" x={57} y={30} fontSize={86} color={palette[4]} /></Sequence>
        <Sequence from={ts('00:00:31:060')} durationInFrames={ts('00:00:00:400')}><Word text="you" start="00:00:31:060" end="00:00:31:460" x={50} y={38} fontSize={90} color={palette[5]} active /></Sequence>

        {/* Final sign-off collage ending cleanly with the last spoken words. */}
        <Sequence from={ts('00:00:31:460')} durationInFrames={ts('00:00:00:480')}><Word text="in" start="00:00:31:460" end="00:00:31:940" x={45} y={20} fontSize={76} color={palette[6]} active /></Sequence>
        <Sequence from={ts('00:00:31:940')} durationInFrames={ts('00:00:00:240')}><Word text="in" start="00:00:31:460" end="00:00:31:940" x={45} y={20} fontSize={76} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:31:940')} durationInFrames={ts('00:00:00:240')}><Word text="the" start="00:00:31:940" end="00:00:32:180" x={56} y={24} fontSize={74} color={palette[0]} active /></Sequence>
        <Sequence from={ts('00:00:32:180')} durationInFrames={ts('00:00:00:400')}><Word text="in" start="00:00:31:460" end="00:00:31:940" x={45} y={20} fontSize={76} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:32:180')} durationInFrames={ts('00:00:00:400')}><Word text="the" start="00:00:31:940" end="00:00:32:180" x={56} y={24} fontSize={74} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:32:180')} durationInFrames={ts('00:00:00:400')}><Word text="next" start="00:00:32:180" end="00:00:32:580" x={44} y={30} fontSize={114} color={palette[1]} active /></Sequence>
        <Sequence from={ts('00:00:32:580')} durationInFrames={ts('00:00:00:260')}><Word text="in" start="00:00:31:460" end="00:00:31:940" x={45} y={20} fontSize={76} color={palette[6]} /></Sequence>
        <Sequence from={ts('00:00:32:580')} durationInFrames={ts('00:00:00:260')}><Word text="the" start="00:00:31:940" end="00:00:32:180" x={56} y={24} fontSize={74} color={palette[0]} /></Sequence>
        <Sequence from={ts('00:00:32:580')} durationInFrames={ts('00:00:00:260')}><Word text="next" start="00:00:32:180" end="00:00:32:580" x={44} y={30} fontSize={114} color={palette[1]} /></Sequence>
        <Sequence from={ts('00:00:32:580')} durationInFrames={ts('00:00:00:260')}><Word text="video" start="00:00:32:580" end="00:00:32:840" x={56} y={38} fontSize={122} color={palette[2]} active /></Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={ts('00:00:33:000')}
    fps={24}
    width={1080}
    height={1920}
  />
);

registerRoot(RemotionRoot);

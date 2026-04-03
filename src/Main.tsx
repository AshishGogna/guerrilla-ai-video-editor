import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';

const FPS = 24;
const ts = (t: string) => { const [h, m, s, ms] = t.split(':').map(Number); return Math.round((h * 3600 + m * 60 + s + ms / 1000) * FPS); };

const videoStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  backgroundColor: 'black',
};

const AnimatedWord: React.FC<{
  text: string;
  size: number;
  left: string;
  top: string;
  rotate?: number;
}> = ({text, size, left, top, rotate = 0}) => {
  const frame = useCurrentFrame();
  const pop = spring({
    fps: FPS,
    frame,
    config: {
      damping: 12,
      stiffness: 180,
      mass: 0.7,
    },
  });
  const drift = Math.max(0, 12 - frame * 0.45);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translate(-50%, -50%) scale(${pop}) translateY(${drift}px) rotate(${rotate}deg)`,
        transformOrigin: 'center center',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: 900,
        fontSize: size,
        color: 'white',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        letterSpacing: '-0.03em',
        textShadow: '0 0 2px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.85), 0 10px 24px rgba(0,0,0,0.6)',
        WebkitTextStroke: '2px rgba(0,0,0,0.3)',
      }}
    >
      {text}
    </div>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/* Track 1: Trailer natural sound control track. */}
      <AbsoluteFill>
        {/* Keep the full trailer source present for continuous timeline coverage, but mute it entirely so only the reviewer dialogue drives the final edit. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:33:000')}>
          <OffthreadVideo src={staticFile('trailer.mp4')} startFrom={ts('00:00:00:000')} muted style={{width: 1, height: 1, opacity: 0}} />
        </Sequence>
      </AbsoluteFill>

      {/* Track 2: Master spoken audio track from the reviewer. */}
      <AbsoluteFill>
        {/* Use the reviewer’s full source audio as the primary spoken track for the complete short. All visible edits and animated transcript words are timed against this track. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:33:000')}>
          <Audio src={staticFile('ashish.mp4')} />
        </Sequence>
      </AbsoluteFill>

      {/* Track 3: Primary and only video track. */}
      <AbsoluteFill>
        {/* Start on the reviewer speaking directly to camera to establish the hook and deliver the first recommendation line with clear facial energy and hand movement. Source start matches the timeline start so the visible speaker stays in sync with the continuous master audio. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:05:000')}>
          <OffthreadVideo src={staticFile('ashish.mp4')} startFrom={ts('00:00:00:000')} style={videoStyle} />
        </Sequence>

        {/* Cut to trailer imagery that supports the spoken line about the trailer being chaos and the protagonist floating in space with a dog. Use the trailer portion starting at 00:00:05:000 where the floating-space imagery begins to align with the commentary. */}
        <Sequence from={ts('00:00:05:000')} durationInFrames={ts('00:00:05:000')}>
          <OffthreadVideo src={staticFile('trailer.mp4')} startFrom={ts('00:00:05:000')} muted style={videoStyle} />
        </Sequence>

        {/* Show the neon-lit confrontation material to match the line about taking out rooms of goons in a dive bar. Use the trailer section beginning at 00:01:24:000 for the dive-bar threat and goon confrontation visual. */}
        <Sequence from={ts('00:00:10:000')} durationInFrames={ts('00:00:04:000')}>
          <OffthreadVideo src={staticFile('trailer.mp4')} startFrom={ts('00:01:24:000')} muted style={videoStyle} />
        </Sequence>

        {/* Use high-energy action and explosion trailer footage to pay off the line about her being a total badass while everything explodes. Start from 00:02:00:000 to get the strongest explosion-heavy action beat. */}
        <Sequence from={ts('00:00:14:000')} durationInFrames={ts('00:00:06:000')}>
          <OffthreadVideo src={staticFile('trailer.mp4')} startFrom={ts('00:02:00:000')} muted style={videoStyle} />
        </Sequence>

        {/* Return to the reviewer on camera to re-anchor the edit during the line about heat vision and confidence. Source start matches the timeline start to preserve sync with the ongoing reviewer audio. */}
        <Sequence from={ts('00:00:20:000')} durationInFrames={ts('00:00:04:000')}>
          <OffthreadVideo src={staticFile('ashish.mp4')} startFrom={ts('00:00:20:000')} style={videoStyle} />
        </Sequence>

        {/* Cut back to trailer visuals for the heat-vision payoff and to maintain momentum into the release-date mention. Start from 00:01:50:000 for the strongest heat-vision-related trailer moment. */}
        <Sequence from={ts('00:00:24:000')} durationInFrames={ts('00:00:03:000')}>
          <OffthreadVideo src={staticFile('trailer.mp4')} startFrom={ts('00:01:50:000')} muted style={videoStyle} />
        </Sequence>

        {/* Finish on the reviewer for the release information, share CTA, and sign-off so the ending feels direct and social-first. Source start matches the timeline start so the speaking performance remains perfectly in sync. */}
        <Sequence from={ts('00:00:27:000')} durationInFrames={ts('00:00:06:000')}>
          <OffthreadVideo src={staticFile('ashish.mp4')} startFrom={ts('00:00:27:000')} style={videoStyle} />
        </Sequence>
      </AbsoluteFill>

      {/* Track 4: Dedicated motion graphics overlay track above all other tracks. */}
      <AbsoluteFill>
        {/* First 5-word collage opening on the reviewer hook. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={ts('00:00:01:780')}>
          <AnimatedWord text="You" size={62} left="47%" top="16%" rotate={-6} />
        </Sequence>
        <Sequence from={ts('00:00:00:820')} durationInFrames={ts('00:00:00:960')}>
          <AnimatedWord text="need" size={70} left="56%" top="18%" rotate={5} />
        </Sequence>
        <Sequence from={ts('00:00:00:960')} durationInFrames={ts('00:00:00:820')}>
          <AnimatedWord text="to" size={48} left="49%" top="24%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={ts('00:00:00:460')}>
          <AnimatedWord text="watch" size={64} left="59%" top="24%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:01:320')} durationInFrames={ts('00:00:00:460')}>
          <AnimatedWord text="Supergirl" size={104} left="52%" top="31%" rotate={-3} />
        </Sequence>

        {/* Second 5-word collage continuing the setup phrase. */}
        <Sequence from={ts('00:00:02:020')} durationInFrames={ts('00:00:01:800')}>
          <AnimatedWord text="because" size={56} left="45%" top="17%" rotate={-5} />
        </Sequence>
        <Sequence from={ts('00:00:02:260')} durationInFrames={ts('00:00:01:560')}>
          <AnimatedWord text="this" size={50} left="54%" top="18%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:02:680')} durationInFrames={ts('00:00:01:140')}>
          <AnimatedWord text="protagonist" size={82} left="50%" top="25%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:03:180')} durationInFrames={ts('00:00:00:640')}>
          <AnimatedWord text="has" size={48} left="43%" top="31%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:03:460')} durationInFrames={ts('00:00:00:360')}>
          <AnimatedWord text="a" size={40} left="58%" top="31%" rotate={-4} />
        </Sequence>

        {/* Two-word emphasis batch for the attitude statement. */}
        <Sequence from={ts('00:00:03:820')} durationInFrames={ts('00:00:01:040')}>
          <AnimatedWord text="major" size={60} left="47%" top="20%" rotate={-5} />
        </Sequence>
        <Sequence from={ts('00:00:04:240')} durationInFrames={ts('00:00:00:620')}>
          <AnimatedWord text="attitude" size={108} left="53%" top="28%" rotate={3} />
        </Sequence>

        {/* New collage position for the trailer-chaos line. */}
        <Sequence from={ts('00:00:05:260')} durationInFrames={ts('00:00:01:560')}>
          <AnimatedWord text="The" size={40} left="27%" top="18%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:05:280')} durationInFrames={ts('00:00:01:540')}>
          <AnimatedWord text="trailer" size={60} left="36%" top="19%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:05:360')} durationInFrames={ts('00:00:01:460')}>
          <AnimatedWord text="is" size={42} left="30%" top="25%" rotate={-3} />
        </Sequence>
        <Sequence from={ts('00:00:05:700')} durationInFrames={ts('00:00:01:120')}>
          <AnimatedWord text="absolute" size={84} left="41%" top="26%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:06:400')} durationInFrames={ts('00:00:00:420')}>
          <AnimatedWord text="chaos" size={92} left="33%" top="33%" rotate={3} />
        </Sequence>

        {/* Floating-in-space phrase batch. */}
        <Sequence from={ts('00:00:07:320')} durationInFrames={ts('00:00:01:640')}>
          <AnimatedWord text="showing" size={52} left="34%" top="20%" rotate={-5} />
        </Sequence>
        <Sequence from={ts('00:00:07:340')} durationInFrames={ts('00:00:01:620')}>
          <AnimatedWord text="her" size={44} left="43%" top="21%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:07:580')} durationInFrames={ts('00:00:01:380')}>
          <AnimatedWord text="literally" size={80} left="37%" top="27%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:08:160')} durationInFrames={ts('00:00:00:800')}>
          <AnimatedWord text="floating" size={86} left="47%" top="29%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:08:500')} durationInFrames={ts('00:00:00:460')}>
          <AnimatedWord text="in" size={40} left="40%" top="35%" rotate={-4} />
        </Sequence>

        {/* Short payoff batch for the dog-in-space visual. */}
        <Sequence from={ts('00:00:08:960')} durationInFrames={ts('00:00:00:960')}>
          <AnimatedWord text="space" size={86} left="46%" top="23%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:09:200')} durationInFrames={ts('00:00:00:720')}>
          <AnimatedWord text="with" size={50} left="56%" top="24%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:09:440')} durationInFrames={ts('00:00:00:480')}>
          <AnimatedWord text="a" size={38} left="49%" top="30%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:09:920')} durationInFrames={1}>
          <AnimatedWord text="dog" size={88} left="58%" top="31%" rotate={4} />
        </Sequence>

        {/* Goons/action phrase batch in a new lower-middle position. */}
        <Sequence from={ts('00:00:10:080')} durationInFrames={ts('00:00:02:460')}>
          <AnimatedWord text="taking" size={56} left="47%" top="66%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:10:300')} durationInFrames={ts('00:00:02:240')}>
          <AnimatedWord text="out" size={48} left="57%" top="66%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:10:700')} durationInFrames={ts('00:00:01:840')}>
          <AnimatedWord text="entire" size={80} left="44%" top="73%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:11:360')} durationInFrames={ts('00:00:01:180')}>
          <AnimatedWord text="rooms" size={78} left="57%" top="74%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:11:800')} durationInFrames={ts('00:00:00:740')}>
          <AnimatedWord text="of" size={40} left="50%" top="80%" rotate={-3} />
        </Sequence>

        {/* Neon-lit dive bar continuation batch. */}
        <Sequence from={ts('00:00:12:540')} durationInFrames={ts('00:00:01:100')}>
          <AnimatedWord text="goons" size={74} left="45%" top="67%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:12:540')} durationInFrames={ts('00:00:01:100')}>
          <AnimatedWord text="in" size={40} left="56%" top="67%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:12:780')} durationInFrames={ts('00:00:00:860')}>
          <AnimatedWord text="a" size={36} left="49%" top="73%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:13:080')} durationInFrames={ts('00:00:00:560')}>
          <AnimatedWord text="neon" size={82} left="59%" top="74%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:13:340')} durationInFrames={ts('00:00:00:300')}>
          <AnimatedWord text="lit" size={48} left="52%" top="80%" rotate={-4} />
        </Sequence>

        {/* Short two-word emphasis for “dive bar.” */}
        <Sequence from={ts('00:00:13:640')} durationInFrames={ts('00:00:00:700')}>
          <AnimatedWord text="dive" size={70} left="47%" top="70%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:14:000')} durationInFrames={ts('00:00:00:340')}>
          <AnimatedWord text="bar" size={76} left="57%" top="76%" rotate={4} />
        </Sequence>

        {/* New collage position for the badass setup line. */}
        <Sequence from={ts('00:00:15:220')} durationInFrames={ts('00:00:01:680')}>
          <AnimatedWord text="and" size={44} left="69%" top="40%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:15:820')} durationInFrames={ts('00:00:01:080')}>
          <AnimatedWord text="basically" size={80} left="76%" top="46%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:16:260')} durationInFrames={ts('00:00:00:640')}>
          <AnimatedWord text="being" size={56} left="68%" top="53%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:16:640')} durationInFrames={ts('00:00:00:260')}>
          <AnimatedWord text="a" size={36} left="79%" top="54%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:16:900')} durationInFrames={ts('00:00:00:520')}>
          <AnimatedWord text="total" size={78} left="73%" top="60%" rotate={-3} />
        </Sequence>

        {/* Explosion statement batch with “badass” as the hero word. */}
        <Sequence from={ts('00:00:17:420')} durationInFrames={ts('00:00:02:200')}>
          <AnimatedWord text="badass" size={100} left="71%" top="43%" rotate={-3} />
        </Sequence>
        <Sequence from={ts('00:00:17:840')} durationInFrames={ts('00:00:01:780')}>
          <AnimatedWord text="while" size={44} left="80%" top="43%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:18:260')} durationInFrames={ts('00:00:01:360')}>
          <AnimatedWord text="everything" size={76} left="71%" top="50%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:18:740')} durationInFrames={ts('00:00:00:880')}>
          <AnimatedWord text="around" size={56} left="81%" top="56%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:19:080')} durationInFrames={ts('00:00:00:540')}>
          <AnimatedWord text="her" size={42} left="73%" top="62%" rotate={-4} />
        </Sequence>

        {/* Single-word impact graphic for “explodes.” */}
        <Sequence from={ts('00:00:19:620')} durationInFrames={ts('00:00:00:460')}>
          <AnimatedWord text="explodes" size={116} left="50%" top="50%" rotate={-2} />
        </Sequence>

        {/* Return-to-reviewer batch for the heat-vision setup. */}
        <Sequence from={ts('00:00:20:300')} durationInFrames={ts('00:00:00:880')}>
          <AnimatedWord text="You" size={50} left="29%" top="61%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:20:480')} durationInFrames={ts('00:00:00:700')}>
          <AnimatedWord text="can" size={46} left="38%" top="61%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:20:640')} durationInFrames={ts('00:00:00:540')}>
          <AnimatedWord text="even" size={56} left="32%" top="67%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:20:860')} durationInFrames={ts('00:00:00:320')}>
          <AnimatedWord text="see" size={46} left="41%" top="68%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:20:980')} durationInFrames={ts('00:00:00:200')}>
          <AnimatedWord text="her" size={48} left="35%" top="74%" rotate={-4} />
        </Sequence>

        {/* Heat vision phrase batch. */}
        <Sequence from={ts('00:00:21:180')} durationInFrames={ts('00:00:01:740')}>
          <AnimatedWord text="heat" size={82} left="29%" top="60%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:21:480')} durationInFrames={ts('00:00:01:440')}>
          <AnimatedWord text="vision" size={86} left="41%" top="60%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:22:020')} durationInFrames={ts('00:00:00:900')}>
          <AnimatedWord text="melting" size={58} left="32%" top="68%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:22:200')} durationInFrames={ts('00:00:00:720')}>
          <AnimatedWord text="faces" size={66} left="43%" top="69%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:22:680')} durationInFrames={ts('00:00:00:240')}>
          <AnimatedWord text="and" size={40} left="36%" top="75%" rotate={-3} />
        </Sequence>

        {/* First half of the “not giving a single” phrase following the 5-word rule. */}
        <Sequence from={ts('00:00:22:920')} durationInFrames={ts('00:00:00:900')}>
          <AnimatedWord text="her" size={44} left="34%" top="62%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:23:100')} durationInFrames={ts('00:00:00:720')}>
          <AnimatedWord text="just" size={48} left="43%" top="62%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:23:360')} durationInFrames={ts('00:00:00:460')}>
          <AnimatedWord text="not" size={50} left="37%" top="68%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:23:560')} durationInFrames={ts('00:00:00:260')}>
          <AnimatedWord text="giving" size={64} left="48%" top="69%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:23:820')} durationInFrames={ts('00:00:00:140')}>
          <AnimatedWord text="a" size={36} left="41%" top="75%" rotate={-4} />
        </Sequence>

        {/* Continuation mini-batch for the remainder of the phrase. */}
        <Sequence from={ts('00:00:23:960')} durationInFrames={ts('00:00:00:580')}>
          <AnimatedWord text="single" size={60} left="39%" top="66%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:24:320')} durationInFrames={ts('00:00:00:220')}>
          <AnimatedWord text="damn" size={106} left="49%" top="73%" rotate={3} />
        </Sequence>

        {/* Release-info setup batch in a new upper-right position. */}
        <Sequence from={ts('00:00:24:660')} durationInFrames={ts('00:00:01:020')}>
          <AnimatedWord text="You" size={48} left="74%" top="16%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:24:800')} durationInFrames={ts('00:00:00:880')}>
          <AnimatedWord text="can" size={44} left="82%" top="16%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:24:960')} durationInFrames={ts('00:00:00:720')}>
          <AnimatedWord text="watch" size={74} left="76%" top="23%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:25:140')} durationInFrames={ts('00:00:00:540')}>
          <AnimatedWord text="it" size={36} left="85%" top="23%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:25:260')} durationInFrames={ts('00:00:00:420')}>
          <AnimatedWord text="in" size={40} left="79%" top="29%" rotate={-4} />
        </Sequence>

        {/* Release-date batch emphasizing the date. */}
        <Sequence from={ts('00:00:25:680')} durationInFrames={ts('00:00:01:760')}>
          <AnimatedWord text="theatres" size={52} left="73%" top="18%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:25:780')} durationInFrames={ts('00:00:01:660')}>
          <AnimatedWord text="starting" size={54} left="81%" top="24%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:26:180')} durationInFrames={ts('00:00:01:260')}>
          <AnimatedWord text="June" size={88} left="74%" top="31%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:26:560')} durationInFrames={ts('00:00:00:880')}>
          <AnimatedWord text="26th" size={94} left="83%" top="32%" rotate={3} />
        </Sequence>

        {/* CTA opening 5-word batch. */}
        <Sequence from={ts('00:00:27:440')} durationInFrames={ts('00:00:01:340')}>
          <AnimatedWord text="Do" size={40} left="29%" top="17%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:27:740')} durationInFrames={ts('00:00:01:040')}>
          <AnimatedWord text="share" size={82} left="39%" top="18%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:28:000')} durationInFrames={ts('00:00:00:780')}>
          <AnimatedWord text="this" size={48} left="32%" top="24%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:28:260')} durationInFrames={ts('00:00:00:520')}>
          <AnimatedWord text="with" size={52} left="42%" top="24%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:28:360')} durationInFrames={ts('00:00:00:420')}>
          <AnimatedWord text="a" size={36} left="36%" top="30%" rotate={-4} />
        </Sequence>

        {/* Friend/take-with-you phrase batch. */}
        <Sequence from={ts('00:00:28:780')} durationInFrames={ts('00:00:01:020')}>
          <AnimatedWord text="friend" size={80} left="36%" top="20%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:28:780')} durationInFrames={ts('00:00:01:020')}>
          <AnimatedWord text="you" size={40} left="47%" top="20%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:28:920')} durationInFrames={ts('00:00:00:880')}>
          <AnimatedWord text="wanna" size={58} left="39%" top="27%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:29:160')} durationInFrames={ts('00:00:00:640')}>
          <AnimatedWord text="take" size={56} left="50%" top="27%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:29:560')} durationInFrames={ts('00:00:00:240')}>
          <AnimatedWord text="with" size={48} left="44%" top="33%" rotate={-4} />
        </Sequence>

        {/* Final sentence first 5-word batch. */}
        <Sequence from={ts('00:00:29:800')} durationInFrames={ts('00:00:01:660')}>
          <AnimatedWord text="you" size={46} left="49%" top="16%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:30:480')} durationInFrames={ts('00:00:00:980')}>
          <AnimatedWord text="and" size={42} left="58%" top="17%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:30:560')} durationInFrames={ts('00:00:00:900')}>
          <AnimatedWord text="I’ll" size={56} left="52%" top="23%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:30:860')} durationInFrames={ts('00:00:00:600')}>
          <AnimatedWord text="see" size={50} left="61%" top="24%" rotate={3} />
        </Sequence>
        <Sequence from={ts('00:00:31:060')} durationInFrames={ts('00:00:00:400')}>
          <AnimatedWord text="you" size={48} left="55%" top="30%" rotate={-4} />
        </Sequence>

        {/* Final sign-off remainder batch. */}
        <Sequence from={ts('00:00:31:460')} durationInFrames={ts('00:00:01:380')}>
          <AnimatedWord text="in" size={38} left="48%" top="18%" rotate={-4} />
        </Sequence>
        <Sequence from={ts('00:00:31:940')} durationInFrames={ts('00:00:00:900')}>
          <AnimatedWord text="the" size={42} left="56%" top="18%" rotate={4} />
        </Sequence>
        <Sequence from={ts('00:00:32:180')} durationInFrames={ts('00:00:00:660')}>
          <AnimatedWord text="next" size={76} left="49%" top="24%" rotate={-2} />
        </Sequence>
        <Sequence from={ts('00:00:32:580')} durationInFrames={ts('00:00:00:260')}>
          <AnimatedWord text="video" size={84} left="60%" top="25%" rotate={3} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

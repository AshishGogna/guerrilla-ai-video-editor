import React from 'react';
import {AbsoluteFill, Audio, Composition, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, registerRoot} from 'remotion';

const FPS = 24;
const ts = (t: string) => { const [h, m, s, ms] = t.split(':').map(Number); return Math.round((h * 3600 + m * 60 + s + ms / 1000) * FPS); };
const dur = (t: string) => Math.max(1, ts(t));

const fitCoverStyle = ({scale = 1, x = 50, y = 50}: {scale?: number; x?: number; y?: number;}): React.CSSProperties => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: `scale(${scale})`,
  objectPosition: `${x}% ${y}%`,
});

const TimeCard: React.FC<{
  text: string;
  color: string;
  glow?: string;
  underline?: string;
  from: string;
  duration: string;
  styleType: 'whip' | 'glitch' | 'radar' | 'turbulence' | 'hud' | 'gleam';
}> = ({text, color, glow, underline, styleType}) => {
  const frame = useCurrentFrame();
  const inFrames = 6;
  const xBase = 194;
  const yBase = 269;

  const whipX = interpolate(frame, [0, inFrames], [-220, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacityIn = interpolate(frame, [0, 2, inFrames], [0, 0.8, 1], {extrapolateRight: 'clamp'});
  const shake = styleType === 'whip' ? Math.sin(frame * 0.9) * 1.5 : styleType === 'turbulence' ? Math.sin(frame * 1.3) * 3 : 0;
  const scale = styleType === 'turbulence'
    ? interpolate(frame, [0, 5], [0.85, 1], {extrapolateRight: 'clamp'})
    : 1;
  const glitchOpacity = styleType === 'glitch' ? (frame < 4 ? [0.2, 1, 0.4, 1][frame] ?? 1 : 1) : 1;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: xBase + (styleType === 'whip' ? whipX : 0),
          top: yBase + shake,
          opacity: styleType === 'whip' ? opacityIn : glitchOpacity,
          transform: `scale(${scale})`,
          color,
          fontFamily: 'Arial Black, Impact, sans-serif',
          fontSize: 86,
          lineHeight: 1,
          letterSpacing: 2,
          textTransform: 'uppercase',
          textShadow: glow ? `0 0 12px ${glow}, 0 0 24px ${glow}` : '0 2px 10px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{position: 'relative', display: 'inline-block'}}>
          {styleType === 'radar' && (
            <div
              style={{
                position: 'absolute',
                inset: -12,
                background: `linear-gradient(90deg, transparent 0%, rgba(120,255,255,0.0) 35%, rgba(120,255,255,0.28) 50%, rgba(120,255,255,0.0) 65%, transparent 100%)`,
                transform: `translateX(${interpolate(frame, [0, 12], [-180, 180], {extrapolateRight: 'clamp'})}px)`,
                mixBlendMode: 'screen',
              }}
            />
          )}
          {styleType === 'hud' && (
            <>
              <div style={{position: 'absolute', left: -22, top: -14, width: 24, height: 24, borderLeft: '3px solid #8aff8a', borderTop: '3px solid #8aff8a'}} />
              <div style={{position: 'absolute', right: -22, top: -14, width: 24, height: 24, borderRight: '3px solid #8aff8a', borderTop: '3px solid #8aff8a'}} />
              <div style={{position: 'absolute', left: -22, bottom: -14, width: 24, height: 24, borderLeft: '3px solid #8aff8a', borderBottom: '3px solid #8aff8a'}} />
              <div style={{position: 'absolute', right: -22, bottom: -14, width: 24, height: 24, borderRight: '3px solid #8aff8a', borderBottom: '3px solid #8aff8a'}} />
            </>
          )}
          {styleType === 'radar' && (
            <>
              <div style={{position: 'absolute', left: -18, top: -10, width: 20, height: 20, borderLeft: '2px solid #9fefff', borderTop: '2px solid #9fefff'}} />
              <div style={{position: 'absolute', right: -18, top: -10, width: 20, height: 20, borderRight: '2px solid #9fefff', borderTop: '2px solid #9fefff'}} />
              <div style={{position: 'absolute', left: -18, bottom: -10, width: 20, height: 20, borderLeft: '2px solid #9fefff', borderBottom: '2px solid #9fefff'}} />
              <div style={{position: 'absolute', right: -18, bottom: -10, width: 20, height: 20, borderRight: '2px solid #9fefff', borderBottom: '2px solid #9fefff'}} />
            </>
          )}
          {styleType === 'glitch' && (
            <>
              <div style={{position: 'absolute', left: -16, top: 18, width: 8, height: 8, borderRadius: 999, background: '#ff3b3b', opacity: frame % 6 < 3 ? 1 : 0.3}} />
              <div style={{position: 'absolute', left: -2, top: -18, width: 6, height: 6, borderRadius: 999, background: '#ff3b3b', opacity: frame % 4 < 2 ? 1 : 0.2}} />
              <div style={{position: 'absolute', right: -14, top: 8, width: 7, height: 7, borderRadius: 999, background: '#ff3b3b', opacity: frame % 5 < 2 ? 1 : 0.2}} />
            </>
          )}
          {styleType === 'turbulence' && (
            <div style={{position: 'absolute', left: -40, bottom: 14, display: 'flex', gap: 8}}>
              {[0, 1, 2].map((i) => <div key={i} style={{width: 18, height: 4, background: '#ffb15a', transform: 'skewX(-35deg)', opacity: frame < 8 ? 0.9 - i * 0.2 : 0}} />)}
            </div>
          )}
          {styleType === 'gleam' && (
            <div
              style={{
                position: 'absolute',
                inset: -8,
                background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%)',
                transform: `translateX(${interpolate(frame, [4, 14], [-160, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`,
                mixBlendMode: 'screen',
              }}
            />
          )}
          <div>{text}</div>
        </div>
        {underline ? (
          <div
            style={{
              marginTop: 10,
              width: interpolate(frame, [0, 6], [0, 180], {extrapolateRight: 'clamp'}),
              height: 4,
              background: underline,
            }}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const YouWinGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 3, 5], [0.7, 1.12, 1], {extrapolateRight: 'clamp'});
  const shakeX = frame < 8 ? Math.sin(frame * 2.2) * 8 : 0;
  const shakeY = frame < 8 ? Math.cos(frame * 2.4) * 5 : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {[...new Array(12)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        const dist = interpolate(frame, [0, 6], [0, 90 + (i % 3) * 18], {extrapolateRight: 'clamp'});
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 8,
              height: 8,
              background: i % 2 === 0 ? '#ffffff' : '#ff3d3d',
              transform: `translate(${Math.cos(angle) * dist + shakeX}px, ${Math.sin(angle) * dist + shakeY}px)`,
              borderRadius: 2,
              opacity: interpolate(frame, [0, 8], [1, 0], {extrapolateRight: 'clamp'}),
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
          fontFamily: 'Arial Black, Impact, sans-serif',
          fontSize: 120,
          color: '#fff',
          letterSpacing: 2,
          textTransform: 'uppercase',
          WebkitTextStroke: '2px rgba(255,255,255,0.15)',
          textShadow: '8px 8px 0 #c42828, 0 6px 24px rgba(0,0,0,0.45)',
        }}
      >
        YOU WIN
      </div>
    </AbsoluteFill>
  );
};

const DumbassGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 4, 8], [120, -20, 0], {extrapolateRight: 'clamp'});
  const sparkle = frame % 14;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '84%',
          transform: `translate(-50%, -50%) translateY(${y}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: 74,
            color: '#ffe329',
            WebkitTextStroke: '5px black',
            textShadow: '0 8px 0 #d12d2d, 0 10px 24px rgba(0,0,0,0.35)',
            letterSpacing: 1,
          }}
        >
          DUMBASS OF THE YEAR
          <div style={{position: 'absolute', left: sparkle * 18, top: -10, width: 10, height: 10, background: '#fff7a8', transform: 'rotate(45deg)', opacity: sparkle < 6 ? 1 : 0}} />
          <div style={{position: 'absolute', right: sparkle * 14, top: 20, width: 8, height: 8, background: '#fff7a8', transform: 'rotate(45deg)', opacity: sparkle > 7 ? 1 : 0}} />
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            fontSize: 34,
            color: 'white',
            letterSpacing: 1,
          }}
        >
          training drill champion
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BlackoutGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = frame < 4 ? interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  const pulse = frame > 8 ? 0.18 + Math.sin((frame - 8) * 0.7) * 0.06 : 0;
  return (
    <AbsoluteFill style={{backgroundColor: 'black', opacity}}>
      <div
        style={{
          position: 'absolute',
          inset: -120,
          background: `radial-gradient(circle at center, rgba(0,0,0,${0.92 - pulse}) 0%, rgba(0,0,0,${0.98 - pulse / 2}) 45%, rgba(0,0,0,1) 85%)`,
          filter: 'blur(18px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <AbsoluteFill>
        {/* Cut placed here to open with the foreshadow ascent shot before revealing the monkey pilot. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={dur('00:00:01:000')}>
          <OffthreadVideo src={staticFile('7.mp4')} startFrom={ts('00:00:03:000')} muted style={fitCoverStyle({scale: 1.15, x: 50, y: 46})} />
        </Sequence>

        {/* Cut placed here to match the opening question with the monkey approaching the runway jet. */}
        <Sequence from={ts('00:00:01:000')} durationInFrames={dur('00:00:01:820')}>
          <OffthreadVideo src={staticFile('1.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.12, x: 50, y: 52})} />
        </Sequence>

        {/* Cut placed here to sync the bloodline line with the harness-tightening cockpit buckle moment. */}
        <Sequence from={ts('00:00:02:820')} durationInFrames={dur('00:00:03:560')}>
          <OffthreadVideo src={staticFile('2.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.22, x: 50, y: 48})} />
        </Sequence>

        {/* Cut placed here to hit the 'Fly safe' beat with the thumbs-up beside the cockpit. */}
        <Sequence from={ts('00:00:06:380')} durationInFrames={dur('00:00:02:580')}>
          <OffthreadVideo src={staticFile('3.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.18, x: 54, y: 45})} />
        </Sequence>

        {/* Cut placed here to begin the ignition confusion and Christmas-tree cockpit chaos. */}
        <Sequence from={ts('00:00:08:960')} durationInFrames={dur('00:00:03:640')}>
          <OffthreadVideo src={staticFile('5.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.35, x: 50, y: 50})} />
        </Sequence>

        {/* Cut placed here to continue the alarms and blinking lights with pilot POV controls. */}
        <Sequence from={ts('00:00:12:600')} durationInFrames={dur('00:00:03:000')}>
          <OffthreadVideo src={staticFile('4.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.24, x: 51, y: 56})} />
        </Sequence>

        {/* Cut placed here to emphasize the threat of ejecting with the paw near the red eject button. */}
        <Sequence from={ts('00:00:15:600')} durationInFrames={dur('00:00:01:900')}>
          <OffthreadVideo src={staticFile('6.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.45, x: 49, y: 50})} />
        </Sequence>

        {/* Cut placed here to show the separate liftoff subshot for taking off somehow. */}
        <Sequence from={ts('00:00:17:500')} durationInFrames={dur('00:00:02:000')}>
          <OffthreadVideo src={staticFile('7.mp4')} startFrom={ts('00:00:01:433')} muted style={fitCoverStyle({scale: 1.14, x: 50, y: 47})} />
        </Sequence>

        {/* Cut placed here to carry airborne momentum into the setup for enemy contact. */}
        <Sequence from={ts('00:00:19:500')} durationInFrames={dur('00:00:02:920')}>
          <OffthreadVideo src={staticFile('11.mp4')} startFrom={ts('00:00:03:150')} muted style={fitCoverStyle({scale: 1.08, x: 50, y: 46})} />
        </Sequence>

        {/* Cut placed here to reveal the enemy jet ahead through the cockpit canopy. */}
        <Sequence from={ts('00:00:22:420')} durationInFrames={dur('00:00:02:500')}>
          <OffthreadVideo src={staticFile('8.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.18, x: 50, y: 44})} />
        </Sequence>

        {/* Cut placed here to answer that beat with the opposing pilot already locked in. */}
        <Sequence from={ts('00:00:24:920')} durationInFrames={dur('00:00:02:560')}>
          <OffthreadVideo src={staticFile('9.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.26, x: 50, y: 45})} />
        </Sequence>

        {/* Cut placed here to match the prayer strategy line with the monkey praying in cockpit. */}
        <Sequence from={ts('00:00:27:480')} durationInFrames={dur('00:00:02:160')}>
          <OffthreadVideo src={staticFile('10.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.32, x: 50, y: 43})} />
        </Sequence>

        {/* Cut placed here to visualize missiles screaming past under the banking jet. */}
        <Sequence from={ts('00:00:29:640')} durationInFrames={dur('00:00:02:920')}>
          <OffthreadVideo src={staticFile('14.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.1, x: 50, y: 48})} />
        </Sequence>

        {/* Cut placed here to sync the yanking-the-stick line with the close-up control pull. */}
        <Sequence from={ts('00:00:32:560')} durationInFrames={dur('00:00:02:460')}>
          <OffthreadVideo src={staticFile('12.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.38, x: 50, y: 58})} />
        </Sequence>

        {/* Cut placed here to resume picture on the wake-up beat with instruments and horizon returning. */}
        <Sequence from={ts('00:00:36:160')} durationInFrames={dur('00:00:01:360')}>
          <OffthreadVideo src={staticFile('13.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.2, x: 50, y: 52})} />
        </Sequence>

        {/* Cut placed here to show the evasive move that somehow saves the pilot. */}
        <Sequence from={ts('00:00:37:520')} durationInFrames={dur('00:00:02:080')}>
          <OffthreadVideo src={staticFile('11.mp4')} startFrom={ts('00:00:01:450')} muted style={fitCoverStyle({scale: 1.12, x: 50, y: 47})} />
        </Sequence>

        {/* Cut placed here to show the enemy overshooting and losing alignment. */}
        <Sequence from={ts('00:00:39:600')} durationInFrames={dur('00:00:02:420')}>
          <OffthreadVideo src={staticFile('15.mp4')} startFrom={ts('00:00:01:466')} muted style={fitCoverStyle({scale: 1.08, x: 50, y: 46})} />
        </Sequence>

        {/* Cut placed here to land on the lock-on line with the HUD target reticle. */}
        <Sequence from={ts('00:00:42:020')} durationInFrames={dur('00:00:01:300')}>
          <OffthreadVideo src={staticFile('16.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.28, x: 50, y: 50})} />
        </Sequence>

        {/* Cut placed here to punctuate the fire command with the red button smash. */}
        <Sequence from={ts('00:00:43:320')} durationInFrames={dur('00:00:00:760')}>
          <OffthreadVideo src={staticFile('17.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.45, x: 50, y: 51})} />
        </Sequence>

        {/* Cut placed here to pay off the missile shot with the enemy explosion. */}
        <Sequence from={ts('00:00:44:080')} durationInFrames={dur('00:00:01:460')}>
          <OffthreadVideo src={staticFile('18.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.12, x: 50, y: 47})} />
        </Sequence>

        {/* Cut placed here to match the victory line with the monkey celebrating in cockpit. */}
        <Sequence from={ts('00:00:45:540')} durationInFrames={dur('00:00:01:420')}>
          <OffthreadVideo src={staticFile('19.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.26, x: 50, y: 44})} />
        </Sequence>

        {/* Cut placed here to transition into the triumphant landing feeling like a legend. */}
        <Sequence from={ts('00:00:46:960')} durationInFrames={dur('00:00:02:420')}>
          <OffthreadVideo src={staticFile('20.mp4')} startFrom={ts('00:00:01:233')} muted style={fitCoverStyle({scale: 1.1, x: 50, y: 45})} />
        </Sequence>

        {/* Cut placed here to reveal the awkward training-drill truth on the tarmac. */}
        <Sequence from={ts('00:00:49:380')} durationInFrames={dur('00:00:02:120')}>
          <OffthreadVideo src={staticFile('21.mp4')} startFrom={ts('00:00:02:433')} muted style={fitCoverStyle({scale: 1.18, x: 50, y: 49})} />
        </Sequence>

        {/* Cut placed here to end on the trophy handoff and final dumbass punchline. */}
        <Sequence from={ts('00:00:51:500')} durationInFrames={dur('00:00:02:180')}>
          <OffthreadVideo src={staticFile('22.mp4')} startFrom={ts('00:00:00:000')} muted style={fitCoverStyle({scale: 1.28, x: 50, y: 48})} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Cut placed here to keep the full voiceover continuous from the first frame to the last. */}
        <Sequence from={ts('00:00:00:000')} durationInFrames={dur('00:00:53:680')}>
          <Audio src={staticFile('Voiceover.mp3')} startFrom={ts('00:00:00:000')} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Cut placed here to reinforce the first setup beat with a 7:00 AM time card. */}
        <Sequence from={ts('00:00:01:800')} durationInFrames={dur('00:00:00:900')}>
          <TimeCard text="7:00 AM" color="#f1ede4" glow="rgba(255,255,255,0.12)" underline="#d92b2b" from="00:00:01:800" duration="00:00:00:900" styleType="whip" />
        </Sequence>

        {/* Cut placed here to reinforce the cockpit chaos section with a warning-red time card. */}
        <Sequence from={ts('00:00:11:340')} durationInFrames={dur('00:00:00:900')}>
          <TimeCard text="7:05 AM" color="#ff3f3f" glow="rgba(255,80,80,0.35)" styleType="glitch" from="00:00:11:340" duration="00:00:00:900" />
        </Sequence>

        {/* Cut placed here to mark first enemy contact with a radar-scan time card. */}
        <Sequence from={ts('00:00:22:420')} durationInFrames={dur('00:00:00:900')}>
          <TimeCard text="7:15 AM" color="#ffffff" glow="rgba(120,255,255,0.28)" styleType="radar" from="00:00:22:420" duration="00:00:00:900" />
        </Sequence>

        {/* Cut placed here to label the missile attack section with a turbulence-hit time card. */}
        <Sequence from={ts('00:00:30:140')} durationInFrames={dur('00:00:00:900')}>
          <TimeCard text="7:20 AM" color="#ffffff" glow="rgba(255,170,70,0.24)" styleType="turbulence" from="00:00:30:140" duration="00:00:00:900" />
        </Sequence>

        {/* Cut placed here to sell the blackout gag with a full-frame consciousness-fade graphic. */}
        <Sequence from={ts('00:00:35:020')} durationInFrames={dur('00:00:01:140')}>
          <BlackoutGraphic />
        </Sequence>

        {/* Cut placed here to mark the reversal and counterattack beat with a HUD-styled time card. */}
        <Sequence from={ts('00:00:39:920')} durationInFrames={dur('00:00:00:900')}>
          <TimeCard text="7:21 AM" color="#ffffff" glow="rgba(120,255,120,0.2)" styleType="hud" from="00:00:39:920" duration="00:00:00:900" />
        </Sequence>

        {/* Cut placed here to punch the victory moment with a center-screen YOU WIN graphic. */}
        <Sequence from={ts('00:00:45:160')} durationInFrames={dur('00:00:00:800')}>
          <YouWinGraphic />
        </Sequence>

        {/* Cut placed here to introduce the landing/comedic reveal time card with a gleam pass. */}
        <Sequence from={ts('00:00:45:960')} durationInFrames={dur('00:00:00:900')}>
          <TimeCard text="7:30 AM" color="#fff6d6" glow="rgba(255,220,120,0.22)" styleType="gleam" from="00:00:45:960" duration="00:00:00:900" />
        </Sequence>

        {/* Cut placed here to cap the trophy handoff with the final sarcastic award caption. */}
        <Sequence from={ts('00:00:52:080')} durationInFrames={dur('00:00:01:320')}>
          <DumbassGraphic />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={ts('00:00:53:680')} fps={24} width={1080} height={1920} />
);

registerRoot(RemotionRoot);

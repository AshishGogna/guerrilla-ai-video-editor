import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  interpolate,
  registerRoot,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FPS = 24;
const ts = (t: string) => {
  const [h, m, s, ms] = t.split(":").map(Number);
  return Math.round((h * 3600 + m * 60 + s + ms / 1000) * FPS);
};
const dur = (t: string) => Math.max(1, ts(t));

const ACCENT = "#FFD84D";

const videoStyle = (scale: number, xPercent = 0, yPercent = 0): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: `translate(${xPercent}%, ${yPercent}%) scale(${scale})`,
  transformOrigin: "center center",
});

type Word = {
  text: string;
  start: string;
  end: string;
};

type Chunk = {
  start: string;
  end: string;
  lines: string[];
  words: Word[];
};

const SubtitleChunk: React.FC<{
  sequenceFrom: number;
  chunk: Chunk;
  bottomPercent: number;
  fadeOutAtEnd?: boolean;
}> = ({sequenceFrom, chunk, bottomPercent, fadeOutAtEnd = false}) => {
  const frame = useCurrentFrame();
  const absFrame = frame + sequenceFrom;
  const chunkStart = ts(chunk.start);
  const chunkEnd = ts(chunk.end);
  const local = absFrame - chunkStart;
  const opacityIn = interpolate(local, [0, 3], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const translateY = interpolate(local, [0, 3], [8, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scale = interpolate(local, [0, 4], [0.96, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const fadeOutStart = fadeOutAtEnd ? Math.max(chunkStart, chunkEnd - 6) : chunkEnd;
  const opacityOut = fadeOutAtEnd
    ? interpolate(absFrame, [fadeOutStart, chunkEnd], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
    : 1;
  const opacity = opacityIn * opacityOut;

  const flattenedWords = chunk.words;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: `${bottomPercent}%`,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 8,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.05,
          color: "white",
          textShadow:
            "0 0 8px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.75), 2px 0 0 rgba(0,0,0,0.75), -2px 0 0 rgba(0,0,0,0.75), 0 -2px 0 rgba(0,0,0,0.75)",
        }}
      >
        {chunk.lines.map((line, lineIndex) => {
          const wordsInLine = line.split(" ");
          const lineWords = flattenedWords.slice(
            flattenedWords.slice(0, 0).length + chunk.lines.slice(0, lineIndex).join(" ").split(" ").filter(Boolean).length,
            flattenedWords.slice(0, 0).length + chunk.lines.slice(0, lineIndex + 1).join(" ").split(" ").filter(Boolean).length,
          );
          return (
            <div key={lineIndex} style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16}}>
              {wordsInLine.map((rawWord, i) => {
                const word = lineWords[i];
                const isActive =
                  word && ts(word.start) < ts(word.end)
                    ? absFrame >= ts(word.start) && absFrame < ts(word.end)
                    : false;
                return (
                  <span key={`${lineIndex}-${i}`} style={{color: isActive ? ACCENT : "white"}}>
                    {rawWord}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SubtitleTrack: React.FC<{
  chunks: Chunk[];
  bottomPercent: number;
  fadeLastChunk?: boolean;
}> = ({chunks, bottomPercent, fadeLastChunk = false}) => {
  return (
    <AbsoluteFill>
      {chunks.map((chunk, i) => (
        <Sequence
          key={i}
          from={ts(chunk.start)}
          durationInFrames={Math.max(1, ts(chunk.end) - ts(chunk.start))}
        >
          <SubtitleChunk
            sequenceFrom={ts(chunk.start)}
            chunk={chunk}
            bottomPercent={bottomPercent}
            fadeOutAtEnd={fadeLastChunk && i === chunks.length - 1}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const WordOfDayGraphic: React.FC<{sequenceFrom: number}> = ({sequenceFrom}) => {
  const frame = useCurrentFrame();
  const absFrame = frame + sequenceFrom;
  const start = ts("00:00:06:980");
  const fadeStart = ts("00:00:08:780");
  const end = ts("00:00:09:180");
  const reveal = absFrame - start;

  const burstScale = interpolate(reveal, [0, 4], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const wordScaleA = interpolate(reveal, [0, 4, 8], [0.6, 1.12, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const rotation = interpolate(reveal, [0, 8], [-4, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const exitProgress = interpolate(absFrame, [fadeStart, end], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const stackTranslateY = interpolate(exitProgress, [0, 1], [0, -0.06 * 1920], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const stackScale = interpolate(exitProgress, [0, 1], [1, 0.8], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const stackOpacity = interpolate(exitProgress, [0, 1], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          width: 594,
          height: 594,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.35)",
          transform: `scale(${burstScale})`,
          opacity: stackOpacity,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `translateY(${stackTranslateY}px) scale(${stackScale})`,
          opacity: stackOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: "#10264D",
            color: "white",
            padding: "10px 22px",
            borderRadius: 18,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Word of the Day
        </div>
        <div style={{width: 180, height: 12, backgroundColor: ACCENT, borderRadius: 999}} />
        <div
          style={{
            fontFamily: "Arial Black, Arial, Helvetica, sans-serif",
            fontWeight: 900,
            fontSize: 118,
            lineHeight: 0.95,
            color: "white",
            WebkitTextStroke: "10px #10264D",
            textShadow: "0 0 20px rgba(255,216,77,0.85), 0 0 36px rgba(255,216,77,0.65)",
            transform: `scale(${wordScaleA}) rotate(${rotation}deg)`,
            width: "70%",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          OBFUSCATE
        </div>
        <div style={{width: 180, height: 12, backgroundColor: ACCENT, borderRadius: 999}} />
      </div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const subtitle1: Chunk[] = [
    {
      start: "00:00:00:000",
      end: "00:00:01:140",
      lines: ["What do you"],
      words: [
        {text: "What", start: "00:00:00:000", end: "00:00:00:900"},
        {text: "do", start: "00:00:00:900", end: "00:00:00:980"},
        {text: "you", start: "00:00:00:980", end: "00:00:01:140"},
      ],
    },
    {
      start: "00:00:01:140",
      end: "00:00:01:740",
      lines: ["call it when"],
      words: [
        {text: "call", start: "00:00:01:140", end: "00:00:01:380"},
        {text: "it", start: "00:00:01:380", end: "00:00:01:560"},
        {text: "when", start: "00:00:01:560", end: "00:00:01:740"},
      ],
    },
    {
      start: "00:00:01:740",
      end: "00:00:02:520",
      lines: ["someone makes a"],
      words: [
        {text: "someone", start: "00:00:01:740", end: "00:00:02:000"},
        {text: "makes", start: "00:00:02:000", end: "00:00:02:240"},
        {text: "a", start: "00:00:02:240", end: "00:00:02:520"},
      ],
    },
    {
      start: "00:00:02:520",
      end: "00:00:03:620",
      lines: ["simple answer"],
      words: [
        {text: "simple", start: "00:00:02:520", end: "00:00:03:080"},
        {text: "answer", start: "00:00:03:080", end: "00:00:03:620"},
      ],
    },
    {
      start: "00:00:03:620",
      end: "00:00:05:320",
      lines: ["sound confusing on", "purpose?"],
      words: [
        {text: "sound", start: "00:00:03:620", end: "00:00:04:280"},
        {text: "confusing", start: "00:00:04:280", end: "00:00:04:680"},
        {text: "on", start: "00:00:04:680", end: "00:00:05:040"},
        {text: "purpose?", start: "00:00:05:040", end: "00:00:05:320"},
      ],
    },
  ];

  const subtitle2: Chunk[] = [
    {
      start: "00:00:05:820",
      end: "00:00:08:460",
      lines: ["The word is obfuscate."],
      words: [
        {text: "The", start: "00:00:05:820", end: "00:00:06:840"},
        {text: "word", start: "00:00:06:840", end: "00:00:07:200"},
        {text: "is", start: "00:00:07:200", end: "00:00:07:680"},
        {text: "obfuscate.", start: "00:00:07:680", end: "00:00:08:460"},
      ],
    },
  ];

  const subtitle3: Chunk[] = [
    {
      start: "00:00:08:960",
      end: "00:00:10:320",
      lines: ["But most people"],
      words: [
        {text: "But", start: "00:00:08:960", end: "00:00:09:920"},
        {text: "most", start: "00:00:09:920", end: "00:00:10:320"},
        {text: "people", start: "00:00:10:320", end: "00:00:10:880"},
      ],
    },
    {
      start: "00:00:10:320",
      end: "00:00:11:860",
      lines: ["don’t know how to"],
      words: [
        {text: "don’t", start: "00:00:10:880", end: "00:00:11:440"},
        {text: "know", start: "00:00:11:440", end: "00:00:11:860"},
        {text: "how", start: "00:00:11:860", end: "00:00:12:220"},
        {text: "to", start: "00:00:12:220", end: "00:00:12:780"},
      ],
    },
    {
      start: "00:00:11:860",
      end: "00:00:13:560",
      lines: ["use this word."],
      words: [
        {text: "use", start: "00:00:12:780", end: "00:00:12:780"},
        {text: "this", start: "00:00:12:780", end: "00:00:13:180"},
        {text: "word.", start: "00:00:13:180", end: "00:00:13:560"},
      ],
    },
  ];

  const subtitle4: Chunk[] = [
    {
      start: "00:00:14:060",
      end: "00:00:15:080",
      lines: ["So you can simply"],
      words: [
        {text: "So", start: "00:00:14:060", end: "00:00:14:300"},
        {text: "you", start: "00:00:14:300", end: "00:00:14:420"},
        {text: "can", start: "00:00:14:420", end: "00:00:14:680"},
        {text: "simply", start: "00:00:14:680", end: "00:00:15:080"},
      ],
    },
    {
      start: "00:00:15:080",
      end: "00:00:16:100",
      lines: ["say, he tried to"],
      words: [
        {text: "say,", start: "00:00:15:080", end: "00:00:15:360"},
        {text: "he", start: "00:00:15:700", end: "00:00:15:840"},
        {text: "tried", start: "00:00:15:840", end: "00:00:16:100"},
        {text: "to", start: "00:00:16:100", end: "00:00:16:640"},
      ],
    },
    {
      start: "00:00:16:100",
      end: "00:00:17:500",
      lines: ["obfuscate the truth"],
      words: [
        {text: "obfuscate", start: "00:00:16:640", end: "00:00:17:040"},
        {text: "the", start: "00:00:17:040", end: "00:00:17:260"},
        {text: "truth", start: "00:00:17:260", end: "00:00:17:500"},
      ],
    },
    {
      start: "00:00:17:500",
      end: "00:00:18:820",
      lines: ["with complicated words."],
      words: [
        {text: "with", start: "00:00:17:500", end: "00:00:17:860"},
        {text: "complicated", start: "00:00:17:860", end: "00:00:18:440"},
        {text: "words.", start: "00:00:18:440", end: "00:00:18:820"},
      ],
    },
  ];

  const subtitle5: Chunk[] = [
    {
      start: "00:00:19:320",
      end: "00:00:20:000",
      lines: ["See you in"],
      words: [
        {text: "See", start: "00:00:19:320", end: "00:00:19:880"},
        {text: "you", start: "00:00:19:880", end: "00:00:19:980"},
        {text: "in", start: "00:00:19:980", end: "00:00:20:120"},
      ],
    },
    {
      start: "00:00:20:000",
      end: "00:00:21:400",
      lines: ["the next video!"],
      words: [
        {text: "the", start: "00:00:20:120", end: "00:00:20:280"},
        {text: "next", start: "00:00:20:280", end: "00:00:20:560"},
        {text: "video!", start: "00:00:20:560", end: "00:00:20:900"},
      ],
    },
  ];

  return (
    <AbsoluteFill style={{backgroundColor: "black"}}>
      <AbsoluteFill>
        {/* Cut 1 starts the stitched talking-head sequence at timeline start for the opening hook. */}
        <Sequence from={ts("00:00:00:000")} durationInFrames={dur("00:00:05:820")}>
          <OffthreadVideo
            src={staticFile("a7/a7-1.mp4")}
            startFrom={ts("00:00:00:000")}
            style={videoStyle(1.12, 0, -4)}
          />
        </Sequence>

        {/* Cut 2 follows immediately with a hard cut to maintain fast punchy pacing for the reveal setup. */}
        <Sequence from={ts("00:00:05:820")} durationInFrames={dur("00:00:03:140")}>
          <OffthreadVideo
            src={staticFile("a7/a7-2.mp4")}
            startFrom={ts("00:00:00:000")}
            style={videoStyle(1.1, 0, -2)}
          />
        </Sequence>

        {/* Cut 3 continues with full-source breathing room while preserving the no-gap stitched narration flow. */}
        <Sequence from={ts("00:00:08:960")} durationInFrames={dur("00:00:05:100")}>
          <OffthreadVideo
            src={staticFile("a7/a7-3.mp4")}
            startFrom={ts("00:00:00:000")}
            style={videoStyle(1.14, 3, -3)}
          />
        </Sequence>

        {/* Cut 4 hard cuts into the example sentence section to keep momentum while showing the full spoken line. */}
        <Sequence from={ts("00:00:14:060")} durationInFrames={dur("00:00:05:260")}>
          <OffthreadVideo
            src={staticFile("a7/a7-4.mp4")}
            startFrom={ts("00:00:00:000")}
            style={videoStyle(1.16, 0, -3)}
          />
        </Sequence>

        {/* Cut 5 trims the source start to skip opening silence and closes crisply on the farewell line. */}
        <Sequence from={ts("00:00:19:320")} durationInFrames={dur("00:00:02:800")}>
          <OffthreadVideo
            src={staticFile("a7/a7-5.mp4")}
            startFrom={ts("00:00:00:220")}
            style={videoStyle(1.1, -2, -2)}
          />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* Subtitle block 1 covers the hook line with punchy grouped karaoke timing. */}
        <SubtitleTrack chunks={subtitle1} bottomPercent={30} />

        {/* Subtitle block 2 stays slightly lower to avoid collision with the center hero word reveal. */}
        <SubtitleTrack chunks={subtitle2} bottomPercent={32} />

        {/* Subtitle block 3 continues the explanation with identical styling and chunked readability. */}
        <SubtitleTrack chunks={subtitle3} bottomPercent={30} />

        {/* Subtitle block 4 presents the example sentence in fast readable chunks without covering the subject. */}
        <SubtitleTrack chunks={subtitle4} bottomPercent={30} />

        {/* Subtitle block 5 delivers the farewell and gently fades the final chunk by the end of the subtitle clip. */}
        <SubtitleTrack chunks={subtitle5} bottomPercent={30} fadeLastChunk />
      </AbsoluteFill>

      <AbsoluteFill>
        {/* The hero word graphic lands just before “obfuscate” to create the planned attention-grabbing center reveal. */}
        <Sequence from={ts("00:00:06:980")} durationInFrames={dur("00:00:02:200")}>
          <WordOfDayGraphic sequenceFrom={ts("00:00:06:980")} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={dur("00:00:22:120")}
    fps={24}
    width={1080}
    height={1920}
  />
);

registerRoot(RemotionRoot);

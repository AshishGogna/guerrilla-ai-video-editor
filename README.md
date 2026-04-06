# Guerrilla AI Video Editor

An AI Agent that edits videos from you.
Inputs = prompts and clips.
Output = final, edited video.

## Demo 

[![Demo Video 1 - Supergirl trailer review](https://youtube.com/shorts/F7WOsyBeAmE)](https://youtube.com/shorts/F7WOsyBeAmE)
The Example setion below shows the prompt used to edit this.

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

- `OPENAI_API_KEY` — chat and Whisper transcription
- `GEMINI_API_KEY` — visual transcription of videos

## Run

```bash
npm run guerrilla:edit -- <session-id> <prompt-file-or-text>
```

The prompt can be a path to a text file or inline text (quote it if it has spaces).

**Examples**

```bash
npm run guerrilla:edit -- mysession ./public/VideoEditingPrompt.txt
npm run guerrilla:edit -- mysession "Trim the intro and keep only the hook."
```

The script loads `.env` automatically.

## Outputs

Everything for a run goes under `public/<session-id>/`:

- `editingPlan.txt` — timeline plan from the planning agent
- `<sessionId>_remotion.tsx` in `src/` — generated Remotion entry (composition + `Main`)
- `<sessionId>.mp4` — rendered video
- Transcripts (`*.audio.json`, `*.video.json`), `messageHistory.json`, etc.

Media files referenced in your prompt should live under `public/` (e.g. `public/trailer.mp4`) so Remotion can resolve them with `staticFile()`.

## Example 1
Here's how I made a short - Supergirl film trailer review.
Final edited video - [![Demo Video 1 - Supergirl trailer review](https://youtube.com/shorts/F7WOsyBeAmE)](https://youtube.com/shorts/F7WOsyBeAmE)

Execution command - 
```bash
npm run guerrilla:edit -- supergirl-trailer-review {absolute-path}/guerrilla-ai-video-editor/public/VideoEditingPrompt.txt
```

Prompt written in VideoEditingPrompt.txt - 
```txt
You are a video editor. 

Create a fast and punchy short video edit for a film trailer review.

Use these video clips:
1. Me speaking.
Path - /Users/gogna/AG/MediaMogul/ProductionHouse/guerrilla-ai-video-editor/public/ashish.mp4

2. Trailer video.
Path - /Users/gogna/AG/MediaMogul/ProductionHouse/guerrilla-ai-video-editor/public/trailer.mp4

The video should start with me speaking, then show the trailer scenes according to the lines I speak, while my dialogues are spoken as voiceover.
You can show me speaking in the middle and in the end.
Dialogue audio must not overlap please.
The trailer scene must not fill, they should fit, as they are landscape.
The visuals of the trailer must exactly match the intent of my spoken lines.

Output video resolution: 1080x1920, FPS: 30

Motion graphics:
1. Animated text of the dialogue i speak. The word i speak should be shown as i speak. Arrange the words like collage of different sizes but together. Once we have 5 words already on screen, make all of them disappear and let new 5 come in.
Use "words" from transcript, not "segments". 
You can switch position of texts after like 4-6 seconds each.
```


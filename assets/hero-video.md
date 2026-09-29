# Hero video

Source: `Octopus_tentacle_placing_text_1080p_20260912013130.mp4` (user supplied).
Original: 1920 × 1080, 24 fps, 10 seconds, H.264 + AAC.
Web: 1280 × 720, 24 fps, 10 seconds, H.264, no audio, faststart, CRF 19.

The source has a black background. FFmpeg conversion uses
`format=rgba,colorkey=0x000000:0.075:0.06`, composites over white, then scales.
The first and last frames are empty; the original timeline is retained.
The static poster comes from second 5, cropped to `680:112:300:328`.

`hero-video.js` anchors the word to the heading baseline. In source coordinates,
the settled lettering spans approximately x=460…1460, y=508…647. The main
section stays proportional; only x=0…460 stretches to reach the viewport edge.
The canvas uses at most 2× pixel density and draws on decoded video frames.
Playback pauses outside the hero or in a hidden tab. Reduced motion uses the
static poster and does not load the video on initial render. Playback failures
also restore the poster. The page provides a pause/resume control.

Known source artifact: the withdrawing arm briefly appears to fork around
seconds 3.75–4.5. Improving that anatomy requires editing/regenerating the source.

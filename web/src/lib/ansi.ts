// lib/ansi.ts
import AnsiToHtml from "ansi-to-html";

const ansiConverter = new AnsiToHtml({
  fg: "#FFF", // Default text color
  bg: "#000", // Default background color
  newline: true, // Convert newlines to <br />
  escapeXML: true, // Escape XML/HTML characters
  colors: {
    0: "#000", // Black
    1: "#FF0000", // Red
    2: "#00FF00", // Green
    3: "#FFFF00", // Yellow
    4: "#0000FF", // Blue
    5: "#FF00FF", // Magenta
    6: "#00FFFF", // Cyan
    7: "#FFF", // White
  },
});

export const parseAnsi = (text: string) => {
  return ansiConverter.toHtml(text);
};
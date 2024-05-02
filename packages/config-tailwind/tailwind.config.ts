import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        gttblack: "#040415",
        gttgold: "#FFB432",
        gttcyan: "#69E0C7",
        gttlightpurple: "#8A24FF",
        gttpink: "#FF7D7D",
        gttgreen: "#65CF58",
        gttorgange: "#F15223",
        gttpurple: "#5041AB",
        gttred: "#CC2936",
        gttlightblue: "#5AB1BB",
        gttblue: "#39A2AE",
      },
    },
  },
  plugins: [],
};
export default config;

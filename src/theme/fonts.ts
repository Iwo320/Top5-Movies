import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadFont();
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "600", "700", "800"],
});

export const DISPLAY_FONT = "Bebas Neue";
export const BODY_FONT = interFamily;

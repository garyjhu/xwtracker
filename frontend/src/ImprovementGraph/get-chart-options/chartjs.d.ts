import { InteractionModeFunction } from "chart.js";

declare module "chart.js" {
  interface InteractionModeMap {
    scatterOnly: InteractionModeFunction
  }
}
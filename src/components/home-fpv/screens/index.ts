import { page01Screen } from "./Page01"
import { page02Screen } from "./Page02"
import { page04Screen } from "./Page04"
import { page05Screen } from "./Page05"
import { page06Screen } from "./Page06"

export const HOME_FPV_SCREENS = [
  page01Screen,
  page02Screen,
  page04Screen,
  page05Screen,
  page06Screen,
].sort((a, b) => a.time - b.time)

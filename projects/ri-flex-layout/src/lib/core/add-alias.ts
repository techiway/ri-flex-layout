import { OptionalBreakPoint } from "./breakpoints/break-point-registry";
import { MediaChange } from "./media-change";

export function mergeAlias(dest: MediaChange, source: OptionalBreakPoint): MediaChange {
  dest = dest?.clone() ?? new MediaChange();
  if (source) {
    dest.mqAlias = source.alias;
    dest.mediaQuery = source.mediaQuery;
    dest.suffix = source.suffix as string;
    dest.priority = source.priority as number;
  }
  return dest;
}

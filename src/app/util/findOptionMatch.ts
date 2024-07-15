import { FILLER_OPTIONS } from "../../plugin/util/fillerOptions";

export function findOptionMatch(inputValue: string | undefined) {
  return FILLER_OPTIONS.find(option => {
    if (!inputValue) return false;
    return option.startsWith(inputValue.toUpperCase());
  });
}

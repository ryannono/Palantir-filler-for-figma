import { TFillerOption } from "../../plugin/util/fillerOptions";
import { LoremIpsumGenerator } from "../../plugin/util/loremIpsumGenerator";
import { findOptionMatch } from "./findOptionMatch";
import { NAV_KEYS } from "./NAV_KEYS";

type TPluginState = {
  textNodeSelected: boolean,
  canConfirmFillerType: boolean,
  fillerType?: TFillerOption
  loremIpsum: string;
};

type TPluginStateAction = 
  | { type: "RESET"; }
  | { type: "SET_TEXT_NODE_SELECTED"; payload: boolean}
  | { type: "SET_FILLER_TYPE"; payload?: string; }
  | { type: "SET_CAN_CONFIRM_FILLER_TYPE"; payload: boolean; }
  | { type: "ADJUST_TO_KEYUP"; payload: { currentInputValue?: string; keyPressed: string}; };

export const INITIAL_PLUGIN_STATE: TPluginState = {
  textNodeSelected: false,
  fillerType: undefined,
  canConfirmFillerType: false,
  loremIpsum: "",
}

const ipsumGenerator = new LoremIpsumGenerator();

export function reducer(state: TPluginState, action: TPluginStateAction): TPluginState {
  switch (action.type) {
    case 'RESET':
      return {...INITIAL_PLUGIN_STATE, textNodeSelected: state.textNodeSelected};

    case 'SET_TEXT_NODE_SELECTED':
      return ({ ...state, textNodeSelected: action.payload });

    case 'SET_FILLER_TYPE':
      const fillerType = findOptionMatch(action.payload);
      return ({ ...state, canConfirmFillerType: fillerType ? true : false, fillerType });

    case 'SET_CAN_CONFIRM_FILLER_TYPE':
      return ({ ...state, canConfirmFillerType: action.payload });

    case 'ADJUST_TO_KEYUP':
      const {currentInputValue, keyPressed} = action.payload;

      // step 1 - filler type not yet selected
      if (!state.fillerType) {
        const fillerType = findOptionMatch(currentInputValue);
        const newState = ({ ...state, canConfirmFillerType: fillerType ? true : false });
        return keyPressed === "Enter" ? {...newState, fillerType} : newState;
      }

      // step 2 - entering non numeric key (or backspace to modify number)
      if (isNaN(parseInt(keyPressed))
          && keyPressed !== ' '
          && keyPressed !== "Backspace"
          && !Object.values(NAV_KEYS).includes(keyPressed))
      {
        return state;
      }

      const fillerAmount = Math.min(Number(currentInputValue ?? 0), 1000);

      return ({ ...state, loremIpsum: state.fillerType ? ipsumGenerator.generate(fillerAmount, state.fillerType) : "" });

    default:
      return state;
  }
}

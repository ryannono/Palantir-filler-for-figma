import React, { useCallback, useReducer, useRef } from 'react';
import { OptionButton } from './components/optionButton/optionButton';
import { InputField } from './components/inputField/inputField';
import { Shortcut } from './components/shortcut/shortcut';
import { RemovableTag } from './components/removableTag/removableTag';
import { TFillerOption, FILLER_OPTIONS } from '../plugin/util/fillerOptions';
import { postLoremIpsum } from './util/postLoremIpsum';
import { postClosePlugin } from './util/postClosePlugin';
import { NAV_KEYS } from './util/NAV_KEYS';
import palantirLogo from "./assets/palantirLogo.svg";
import asterics from "./assets/asterics.svg";
import './index.css';
import { INITIAL_PLUGIN_STATE, reducer } from './util/reducer';

function App() {
  const [
    { 
      canConfirmFillerType,
      loremIpsum,
      fillerType,
      textNodeSelected
    }, 
    dispatch 
  ] = useReducer(reducer, INITIAL_PLUGIN_STATE);

  const inputRef = useRef<HTMLInputElement>(null);
  const optionButtonRefs = useRef(FILLER_OPTIONS.map(() => React.createRef<HTMLButtonElement>()));

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  const removeSelection = useCallback(() => dispatch({type: "RESET"}), []);

  const selectButtonOption = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.currentTarget.childNodes[0].textContent ?? undefined) as TFillerOption | undefined;
    dispatch({type: "SET_FILLER_TYPE", payload: buttonText})
    resetInput();
  }, []);

  const onInputKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    dispatch({type: "ADJUST_TO_KEYUP", payload: {keyPressed: e.key, currentInputValue: inputRef.current?.value}})
  }, [])

  const onInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        if (fillerType) postLoremIpsum(loremIpsum);
        else {
          dispatch({type: "SET_FILLER_TYPE", payload: inputRef.current?.value});
          resetInput();
        }   
        break;
        
      case "Backspace":
        if (!inputRef.current?.value) removeSelection();
        break;
    }
  }, [loremIpsum, fillerType]);

  const onPluginKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {    
    if (!Object.values(NAV_KEYS).includes(e.key)) return;
    
    e.preventDefault();
    
    const refs = [inputRef, ...optionButtonRefs.current];
    const currentIndex = refs.findIndex(ref => ref.current === document.activeElement);
    const isArrowUp = e.key === NAV_KEYS.ArrowUp;
    const nextIndex = isArrowUp
      ? (currentIndex === 0 ? refs.length : currentIndex) - 1
      : (currentIndex + 1) % refs.length;
  
    refs[nextIndex]?.current?.focus();
    dispatch({type: "SET_CAN_CONFIRM_FILLER_TYPE", payload: Boolean(nextIndex)})
  };

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, ...rest } = event.data.pluginMessage;
      if (type === 'selectionChange') {
        dispatch({type: "SET_TEXT_NODE_SELECTED", payload: rest.isTextNode})
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") postClosePlugin();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!textNodeSelected) {
    return (
      <div onKeyDown={onPluginKeyDown} className={"zeroStateContainer"}>
        <img className={"palantirLogo"} src={palantirLogo} alt="Palantir Logo" />
        Select a text layer
      </div>)
  }

  return (
    <div onKeyDown={onPluginKeyDown}>
      <InputField
        className={"fixed"}
        ref={inputRef}
        leftItem={fillerType ? 
          <>
            <RemovableTag onRemove={removeSelection} text={fillerType} />
            <img className={"asterics"} src={asterics}/>
          </> : undefined}
        rightItem={<Shortcut disabled={fillerType ? !loremIpsum : !canConfirmFillerType} />}
        autoFocus={true}
        onKeyUp={onInputKeyUp}
        onKeyDown={onInputKeyDown}
        placeholder={!fillerType ? "Enter filler type..." : "Enter amount ( # ) ..."}
      />
      <div className='divider' />
        {!fillerType && 
          <div key={fillerType} className={"optionsContainer"}>
            {FILLER_OPTIONS.map((option, idx) => 
              <OptionButton key={`${option}-button`} ref={optionButtonRefs.current[idx]} onClick={selectButtonOption}>
                {option}
                <Shortcut shortcut={option[0]}/>
              </OptionButton>
            )}
          </div>
        }
        {fillerType && 
          <div className={"previewContainer"}>
            <div className={"ipsumContainer"}>
              {loremIpsum}
            </div>
          </div>
        }
    </div>
  );
}

export default App;

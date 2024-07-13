import React, { useCallback, useRef, useState } from 'react';
import { OptionButton } from './components/optionButton/optionButton';
import { InputField } from './components/inputField/inputField';
import { Shortcut } from './components/shortcut/shortcut';
import { RemovableTag } from './components/removableTag/removableTag';
import { LoremIpsumGenerator } from '../plugin/util/loremIpsumGenerator';
import { TFillerOption, FILLER_OPTIONS } from '../plugin/util/fillerOptions';
import { postLoremIpsum } from './util/postLoremIpsum';
import { postClosePlugin } from './util/postClosePlugin';
import { NAV_KEYS } from './util/NAV_KEYS';
import palantirLogo from "./assets/palantirLogo.svg";
import asterics from "./assets/asterics.svg";
import './index.css';

function App() {
  const [textNodeSelected, setTextNodeSelected] = useState(false);
  const [canConfirmFillerType, setCanConfirmFillerType] = useState(false);
  const [fillerType, setFillerType] = useState<TFillerOption | undefined>(undefined);
  const [loremIpsum, setLoremIpsum] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const optionButtonRefs = useRef(FILLER_OPTIONS.map(() => React.createRef<HTMLButtonElement>()));
  const ipsumGenerator = useRef(new LoremIpsumGenerator());

  const removeSelection = useCallback(() => {
    setFillerType(undefined);
    setCanConfirmFillerType(false);
  }, []);

  const selectButtonOption = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.currentTarget.childNodes[0].textContent ?? undefined) as TFillerOption | undefined;
    setFillerType(buttonText);

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, []);

  const onInputKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;

    if (!fillerType) {
      return setCanConfirmFillerType(FILLER_OPTIONS.some(option => option[0] === inputRef.current?.value[0]?.toUpperCase()));
    }

    // if not cycling through output (with nav keys) or inputting a new amount discard
    if (isNaN(parseInt(e.key)) && e.key !== ' ' && !Object.values(NAV_KEYS).includes(e.key)) return;

    const fillerAmount = Math.min(parseInt(inputRef.current?.value ?? 0), 1000);

    if (fillerAmount > 0) {
      setLoremIpsum(ipsumGenerator.current.generate(fillerAmount, fillerType));
    }
  }, [fillerType])

  const onInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
  
    switch (e.key) {
      case "Enter":
        if (fillerType) return postLoremIpsum(loremIpsum);
        if (!inputRef.current.value) return;
        setFillerType(FILLER_OPTIONS.find(option => inputRef.current?.value[0].toUpperCase() === option[0]));
        inputRef.current.value = "";    
        break;
        
      case "Backspace":
        if (inputRef.current.value) return;
        removeSelection();
        break;
    }
  }, [fillerType, removeSelection, loremIpsum]);

  const onPluginKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") return postClosePlugin();
    
    if (!Object.values(NAV_KEYS).includes(e.key)) return;
    e.preventDefault();
    const refs = [inputRef, ...optionButtonRefs.current];
    const currentIndex = refs.findIndex(ref => ref.current === document.activeElement);
    const isArrowUp = e.key === NAV_KEYS.ArrowUp;
  
    const nextIndex = isArrowUp
      ? (currentIndex === 0 ? refs.length : currentIndex) - 1
      : (currentIndex + 1) % refs.length;
  
    refs[nextIndex]?.current?.focus();
    setCanConfirmFillerType(Boolean(nextIndex));
  };

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, ...rest } = event.data.pluginMessage;
      if (type === 'selectionChange') {
        setTextNodeSelected(rest.isTextNode);
      }
    };
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

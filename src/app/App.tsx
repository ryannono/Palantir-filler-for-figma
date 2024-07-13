import React, { useCallback, useRef, useState } from 'react';
import { OptionButton } from './components/optionButton/optionButton';
import { InputField } from './components/inputField/inputField';
import { Shortcut } from './components/shortcut/shortcut';
import { RemovableTag } from './components/removableTag/removableTag';
import { FILLER_OPTIONS, TFillerOption } from './util/fillerOptions';
import { LoremIpsumGenerator } from './util/loremIpsumGenerator';
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

  const appendLoremIpsum = useCallback(() => {
    parent.postMessage({
      pluginMessage: {
        type: 'appendText',
        text: loremIpsum
      }
    }, '*');
  }, [loremIpsum]);

  const closePlugin = useCallback(() => {
    parent.postMessage({
      pluginMessage: { type: 'close' }
    }, '*');
  }, [loremIpsum]);

  const onInput = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
  
    if (e.type === "keydown") {
      switch (e.key) {
        case "Enter":
          if (fillerType) return appendLoremIpsum();
          if (!inputRef.current.value) return;
          setFillerType(FILLER_OPTIONS.find(option => inputRef.current?.value[0].toUpperCase() === option[0]));
          inputRef.current.value = "";    
          break;
        case "Backspace":
          if (inputRef.current.value) return;
          removeSelection();
          break;
      }
    } else if (e.type === "keyup") {
      const fillerAmount = Math.min(Number(inputRef.current?.value ?? 0), 1000);
      if (fillerType) return setLoremIpsum(ipsumGenerator.current.generate(fillerAmount, fillerType));
      setCanConfirmFillerType(FILLER_OPTIONS.some(option => option[0] === inputRef.current?.value[0]?.toUpperCase()));
    }
  }, [fillerType, appendLoremIpsum, removeSelection]);

  const onPluginKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") return closePlugin();
    
    if (!["ArrowUp", "ArrowDown", "Tab"].includes(e.key)) return;
    e.preventDefault();
    const refs = [inputRef, ...optionButtonRefs.current];
    const currentIndex = refs.findIndex(ref => ref.current === document.activeElement);
    const isArrowUp = e.key === "ArrowUp";
  
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
        onKeyUp={onInput}
        onKeyDown={onInput}
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

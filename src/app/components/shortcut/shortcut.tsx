import React from "react";
import enterKey from "../../assets/enterKey.svg";
import "./shortcut.css";

type TShortcut = {
  shortcut?: string,
  disabled?: boolean,
}

export function Shortcut({shortcut, disabled}: TShortcut) {
  return (
    <div className={`shortcutContainer ${disabled ? "disabled" : ""}`}>
      {shortcut}
      <img src={enterKey} />
    </div>
  )
}
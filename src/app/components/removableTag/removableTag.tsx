import React from "react";
import smallCross from "../../assets/small-cross.svg";
import "./removableTag.css";

type TRemovableTagProps = {
  text: string;
  onRemove: () => void;
}

export function RemovableTag({text, onRemove}:TRemovableTagProps) {
  return (
    <div className="removableTag">
      {text}
      <img onClick={onRemove} src={smallCross} />
    </div>
  )
}
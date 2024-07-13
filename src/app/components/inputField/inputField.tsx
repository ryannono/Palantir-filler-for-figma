import React, { ReactNode, forwardRef, InputHTMLAttributes } from "react";
import palantirLogo from "../../assets/palantirLogo.svg";
import "./inputField.css";

type TInputFieldProps = {
  leftItem?: ReactNode;
  rightItem?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = forwardRef(({
  className,
  leftItem,
  rightItem,
  ...rest
}: TInputFieldProps, ref: React.Ref<HTMLInputElement>) => {

  return (
    <div className={`${className ? className : ''} inputFieldContainer`}>
      <img className={"palantirLogo"} src={palantirLogo} alt="Palantir Logo" />
      <div className={"leftContent"}>
      {leftItem}
      <input
        ref={ref}
        {...rest}
        className={`${className ? className : ''} inputField`}
      />
      </div>
      {rightItem}
    </div>
  );
})


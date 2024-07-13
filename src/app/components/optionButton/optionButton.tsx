import React, { forwardRef } from "react";
import './optionButton.css';

type TOptionButtonProps = React.HtmlHTMLAttributes<HTMLButtonElement>;

export const OptionButton = forwardRef((props: TOptionButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const {className, ...rest} = props;
  return <button {...rest} ref={ref} className={`${className} optionButton`}/>;
});
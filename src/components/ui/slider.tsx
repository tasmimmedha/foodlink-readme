"use client";

import * as React from "react";
import { cn } from "@/lib/helpers";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(e.target.value)];
      onValueChange?.(newValue);
    };

    // Remove defaultValue and value from props to avoid conflicts
    // We'll handle these explicitly based on controlled/uncontrolled mode
    const { defaultValue: propsDefaultValue, value: propsValue, ...inputProps } = props;
    
    // Determine if this is a controlled component
    // Use the value prop from SliderProps if provided, otherwise check props
    const isControlled = value !== undefined;
    
    // For controlled components, use value; for uncontrolled, use defaultValue
    const inputValue = isControlled ? value[0] : undefined;
    const inputDefaultValue = !isControlled && propsDefaultValue 
      ? (Array.isArray(propsDefaultValue) ? propsDefaultValue[0] : propsDefaultValue) 
      : undefined;

    // Build the input props, ensuring only one of value or defaultValue is set
    const inputElementProps: React.InputHTMLAttributes<HTMLInputElement> = {
      ...inputProps,
      type: "range",
      ref,
      min,
      max,
      step,
      onChange: handleChange,
      className: cn(
        "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
        "accent-primary",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md",
        "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md",
        className
      ),
    };

    // Only set value or defaultValue, never both
    if (isControlled) {
      inputElementProps.value = inputValue;
    } else {
      inputElementProps.defaultValue = inputDefaultValue ?? min;
    }

    return <input {...inputElementProps} />;
  }
);
Slider.displayName = "Slider";

export { Slider };


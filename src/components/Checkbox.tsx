import React from "react";

export interface CheckboxProps {
    value: boolean;
    setValue: (value: boolean) => void;
    children: JSX.Element | string;
}

export default function Checkbox(props: CheckboxProps) {
    return (
        <label className="block">
            <input
                className="mr-2"
                type="checkbox"
                checked={props.value}
                onChange={(e) => props.setValue(e.target.checked)}
            />
            <span>{props.children}</span>
        </label>
    );
}

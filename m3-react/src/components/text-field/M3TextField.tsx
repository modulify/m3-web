import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import makeId from '@/utils/id';
import { toClassName } from '@/utils/styling';

export interface M3TextFieldProps extends HTMLAttributes<HTMLElement> {
    id?: string;
    type?: string;
    value?: string | number;
    label?: string;
    placeholder?: string;
    lazy?: boolean;
    multiline?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    outlined?: boolean;
    onUpdateValue?: (value: string | number) => void;
}

const M3TextField: React.FC<M3TextFieldProps> = ({
     id = makeId('m3-text-field'),
     type = 'text',
     value = '',
     label = '',
     placeholder = '',
     lazy = false,
     multiline = false,
     invalid = false,
     disabled = false,
     readonly = false,
     outlined = false,
     className = '',
     children,
     onUpdateValue,
     ...props
 }) => {
    const [focused, setFocused] = useState(false);
    const inputElement = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    const onInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const rawValue = event.target.value;
        if (!lazy) {
            onUpdateValue && onUpdateValue(rawValue);
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const rawValue = event.target.value;
        if (lazy) {
            onUpdateValue && onUpdateValue(rawValue);
        }
    };

    const onFocus = () => {
        setFocused(true);
    };

    const onBlur = () => {
        setFocused(false);
    };

    useEffect(() => {
        const input = inputElement.current;
        if (input) {
            const valueStr = String(value);
            if (valueStr.length) {
                input.value = valueStr;
            } else if (input.value.length) {
                onUpdateValue && onUpdateValue(input.value);
            }
        }
    }, [value, onUpdateValue]);

    return (
        <div
            className={toClassName([className, {
                'm3-text-field': true,
                'm3-text-field_outlined': outlined,
                'm3-text-field_focused': focused,
                'm3-text-field_invalid': invalid,
                'm3-text-field_disabled': disabled,
                'm3-text-field_readonly': readonly,
            }])}
            onClick={() => inputElement.current?.focus()}
            {...props}
        >
            {outlined && <div className="m3-text-field__outline">
                <div className="m3-text-field__outline-leading" />
                <div className="m3-text-field__outline-notch">
                    <label
                        id={`${id}-label`}
                        htmlFor={id}
                        className="m3-text-field__label"
                    >
                        {label}
                    </label>
                </div>
                <div className="m3-text-field__outline-trailing" />
            </div>}

            {!outlined && <label
                id={`${id}-label`}
                htmlFor={id}
                className="m3-text-field__label"
            >
                {label}
            </label>}

            <div className="m3-text-field__state">
                {children}

                {multiline ? (
                    <textarea
                        id={id}
                        ref={inputElement as React.RefObject<HTMLTextAreaElement>}
                        defaultValue={String(value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readonly}
                        aria-invalid={invalid ? 'true' : 'false'}
                        onInput={onInput}
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                ) : (
                    <input
                        id={id}
                        ref={inputElement as React.RefObject<HTMLInputElement>}
                        type={type}
                        defaultValue={String(value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readonly}
                        aria-invalid={invalid ? 'true' : 'false'}
                        onInput={onInput}
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                )}
            </div>

            {!outlined && <div className="m3-text-field__underline" />}
        </div>
    );
};

export default M3TextField;
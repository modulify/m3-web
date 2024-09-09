import React, { FC } from 'react';
import { toClassName } from '@/utils/styling';

export interface M3TextFieldSupportTextProps {
    text?: string;
    danger?: boolean;
    muted?: boolean;
}

const M3TextFieldSupportText: FC<M3TextFieldSupportTextProps> = ({ text = '', danger = false, muted = false, children }) => {
    return (
        <div
            className={toClassName({
                'm3-text-field-support-text': true,
                'm3-text-field-support-text_danger': danger,
                'm3-text-field-support-text_muted': muted,
            })}
        >
            {children || text}
        </div>
    );
};

export default M3TextFieldSupportText;
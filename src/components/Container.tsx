import React, {ReactNode} from 'react';

export const Container = (props: { className?: string, children: ReactNode }) => {
    return (
        <div className={`container mx-auto px-4 ${props.className}`}>
            {props.children}
        </div>
    )
};
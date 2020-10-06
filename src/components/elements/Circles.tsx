import Tooltip from "rc-tooltip";
import React from "react";

interface CirclesProps {
    amount: number;
    total: number;
    label: string;
}

export function Circles({ amount, total, label }: CirclesProps) {
    const size = 18;

    const radius = 7;
    const radiusInner = 4;
    const color = "#444";
    const colorInner = "#111";

    const circleCount = Math.max(amount, total);
    const circles = [];
    for (let i = 0; i < circleCount; i++) {
        const filled = i < amount;

        circles.push(
            <svg key={i} className="inline-block" width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="1.2" stroke={color} fill="none" />
                {filled && <circle cx={size / 2} cy={size / 2} r={radiusInner} fill={colorInner} />}
            </svg>
        );
    }
    return (
        <Tooltip placement="top" overlay={<span>{label}</span>}>
            <span className="inline-flex">{circles}</span>
        </Tooltip>
    );
}

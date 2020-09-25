import React from "react";

interface CirclesProps {
    amount: number;
    total: number;
    label: string;
}

export function Circles({amount, total, label}: CirclesProps) {
    let circlesStr = "";
    for (let i = 0; i < total; i++) {
        circlesStr += i < amount ? "\u25c9" : "\u25cb";
    }
    return <span className="text-xl leading-6 ml-2">{circlesStr}</span>;
}
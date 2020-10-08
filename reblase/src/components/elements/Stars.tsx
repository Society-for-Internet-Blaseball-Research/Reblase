import React from "react";

export function Stars(props: { stars: number }) {
    const starsRounded = Math.round(props.stars * 2) / 2;

    return <span>{starsRounded}</span>;
}

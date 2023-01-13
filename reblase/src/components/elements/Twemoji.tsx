import React from "react";
import { HTMLAttributes } from "react";
import twemoji from "twemoji";

export default React.memo((props: { emoji: string } & HTMLAttributes<HTMLSpanElement>) => {
    const emojiStr = props.emoji.startsWith("0x") ? String.fromCodePoint(parseInt(props.emoji)) : props.emoji;
    return (
        <span
            dangerouslySetInnerHTML={{
                __html: twemoji.parse(emojiStr, {
                    folder: "svg",
                    ext: ".svg",
                }).replace("twemoji.maxcdn.com/v/13.0.1/svg", "bricks.sibr.dev/twemoji"),
            }}
            {...props}
        />
    );
});

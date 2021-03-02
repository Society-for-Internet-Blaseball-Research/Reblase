import { Baserunner } from "../game";
import clsx from "clsx";

export interface BasesProps {
    runners: Baserunner[];
    maxBases: number;
}

function Bases({ runners, maxBases }: BasesProps) {
    const bases: Baserunner[][] = [];
    for (const runner of runners) {
        if (!bases[runner.base]) bases[runner.base] = [];
        bases[runner.base].push(runner);
    }

    const baseCount = Math.max(bases.length, maxBases);

    const elements = [];
    for (let i = baseCount - 1; i >= 0; i--) {
        const runners = bases[i] ?? [];

        elements.push(<Base key={i} filled={runners.length > 0} lift={i % 2 != 0} />);
    }

    return <div className="Bases">{elements}</div>;
}

function Base(props: { filled: boolean; lift: boolean }) {
    const baseSize = 12;
    const boxSize = 18;

    return (
        <svg
            width={boxSize}
            height={boxSize}
            viewBox={`${-boxSize / 2} ${-boxSize / 2} ${boxSize} ${boxSize}`}
            className={clsx("base", props.lift ? "up" : "down")}
        >
            <g>
                <rect
                    className={clsx(props.filled && "filled")}
                    width={baseSize}
                    height={baseSize}
                    x={-baseSize / 2}
                    y={-baseSize / 2}
                />
            </g>
        </svg>
    );
}

export default Bases;

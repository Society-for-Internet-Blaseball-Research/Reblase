import { BlaseballBaserunnerExperimental } from "blaseball-lib/models";
import Tooltip from "rc-tooltip";
import React from "react";

const baseSize = 12;
const axisSize = baseSize * Math.SQRT2;

const baseSpacing = 0.65;
const padding = axisSize / 2 + 1;
const hoverTargetSize = axisSize + 3;

const Base = (props: {
    filled: boolean;
    className?: string;
    baseX: number;
    baseY: number;
    runnerName: string | null;
}) => {
    const x = Math.round(props.baseX * axisSize);
    const y = Math.round(-props.baseY * axisSize);

    const svgElement = (
        <g transform={`translate(${x} ${y}) rotate(45)`}>
            <rect
                fill="transparent"
                stroke="none"
                z="-1"
                x={-hoverTargetSize / 2}
                y={-hoverTargetSize / 2}
                width={hoverTargetSize}
                height={hoverTargetSize}
            />
            <rect
                strokeWidth="1"
                stroke="var(--theme-black)"
                z="1"
                fill={props.filled ? "var(--theme-black)" : "var(--theme-white)"}
                x={-baseSize / 2}
                y={-baseSize / 2}
                width={baseSize}
                height={baseSize}
            />
        </g>
    );

    return props.runnerName ? (
        <Tooltip placement="top" overlay={<span>{props.runnerName}</span>}>
            {svgElement}
        </Tooltip>
    ) : (
        svgElement
    );
};

export interface BaseDisplayProps {
    basesOccupied: number[];
    baseRunnerNames?: string[];
    totalBases: number;
}

export default function BaseDisplay(props: BaseDisplayProps) {
    const highestOccupiedBase = Math.max(...props.basesOccupied);
    const baseCount = Math.max(highestOccupiedBase + 1, props.totalBases);

    const allRunnerNames = props.baseRunnerNames
        ? props.basesOccupied.map((base, idx) => ({ base, name: props.baseRunnerNames![idx] }))
        : null;

    const baseElements = [];
    for (let i = 0; i < baseCount; i++) {
        const baseIndex = baseCount - i - 1;
        const runnerIndex = props.basesOccupied.indexOf(baseIndex);
        const runnerNames = allRunnerNames?.filter(({ base }) => base === baseIndex)?.map(({ name }) => name);
        baseElements.push(
            <Base
                key={i}
                filled={runnerIndex !== -1}
                baseX={baseSpacing * i}
                baseY={[0, baseSpacing][baseIndex % 2]}
                runnerName={runnerNames ? runnerNames.join(", ") : null}
            />
        );
    }

    const verticalBases = 2;
    const horizontalBases = baseCount;

    const totalWidth = Math.round(axisSize * baseSpacing * (horizontalBases - 1) + padding * 2);
    const totalHeight = Math.round(axisSize * baseSpacing * (verticalBases - 1) + padding * 2);
    return (
        <svg
            style={{
                marginTop: "-0.125rem",
            }}
            width={totalWidth}
            height={totalHeight}
            viewBox={`-${padding} ${padding - totalHeight} ${totalWidth} ${totalHeight}`}
        >
            {baseElements}
        </svg>
    );
}

export interface BaseDisplayExperimentalProps {
    baseRunners?: BlaseballBaserunnerExperimental[];
    totalBases: number;
}

export function BaseDisplayExperimental(props: BaseDisplayExperimentalProps) {
    const highestOccupiedBase = Math.max(...props.baseRunners?.map((x) => x.base - 1) ?? [0]);
    
    const baseCount = Math.max(highestOccupiedBase + 1, props.totalBases);
    console.log("baserunners=", props.baseRunners, "numberOfBases=", baseCount);

    const baseElements = [];
    for (let i = 0; i < baseCount; i++) {
        const baseIndex = baseCount - i - 1;
        const runnerNames = props.baseRunners?.filter((base) => (base.base - 1) === baseIndex)?.map((base) => base.name) ?? [];
        baseElements.push(
            <Base
                key={i}
                filled={runnerNames.length > 0}
                baseX={baseSpacing * i}
                baseY={[0, baseSpacing][baseIndex % 2]}
                runnerName={runnerNames ? runnerNames.join(", ") : null}
            />
        );
    }

    const verticalBases = 2;
    const horizontalBases = baseCount;

    const totalWidth = Math.round(axisSize * baseSpacing * (horizontalBases - 1) + padding * 2);
    const totalHeight = Math.round(axisSize * baseSpacing * (verticalBases - 1) + padding * 2);
    return (
        <svg
            style={{
                marginTop: "-0.125rem",
            }}
            width={totalWidth}
            height={totalHeight}
            viewBox={`-${padding} ${padding - totalHeight} ${totalWidth} ${totalHeight}`}
        >
            {baseElements}
        </svg>
    );
}


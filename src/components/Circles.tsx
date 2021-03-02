interface CirclesProps {
    amount: number;
    total: number;
    label: string;
}

function Circles({ amount, total, label }: CirclesProps) {
    const size = 18;

    const radius = 7;
    const radiusInner = 4;

    const circleCount = Math.max(amount, total);
    const circles = [];
    for (let i = 0; i < circleCount; i++) {
        const filled = i < amount;

        circles.push(
            <svg key={i} className={"Circle"} width={size} height={size}>
                <circle className={"outer"} cx={size / 2} cy={size / 2} r={radius} />
                {filled && <circle className={"inner"} cx={size / 2} cy={size / 2} r={radiusInner} />}
            </svg>
        );
    }
    return <span aria-label={`${label}: ${amount}`}>{circles}</span>;
}

export default Circles;

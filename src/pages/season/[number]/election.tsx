import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {
    BlaseballBonusResult,
    BlaseballDecreeResult,
    BlaseballEventResult,
    BlaseballOffseasonRecap,
} from "../../../api/types";

interface SeasonElectionPageProps {
    recap: BlaseballOffseasonRecap;
    bonusResults: { [id: string]: BlaseballBonusResult };
    decreeResults: { [id: string]: BlaseballDecreeResult };
    eventResults: { [id: string]: BlaseballEventResult };
}

function SeasonElectionPage(props: SeasonElectionPageProps) {
    return (
        <div className="container">
            <h1>{props.recap.name}</h1>

            <div>
                <h2>Decrees</h2>

                {props.recap.decreeResults.map((decreeId) => {
                    const result = props.decreeResults[decreeId];
                    return (
                        <div className="DecreeResult" key={decreeId}>
                            <h4>{result.decreeTitle}</h4>
                            <p>{result.description.trim()}</p>
                        </div>
                    );
                })}

                <h2>Blessings</h2>
                {props.recap.bonusResults.map((bonusId) => {
                    const result = props.bonusResults[bonusId];
                    return (
                        <div className="BlessingResult" key={bonusId}>
                            <h4>{result.bonusTitle}</h4>
                            <p>{result.description.trim()}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext<{ number: string }>
): Promise<GetServerSidePropsResult<SeasonElectionPageProps>> {
    const { number } = ctx.params!;

    const internalNumber = parseInt(number) - 1;

    const recap = await fetch(`https://blaseball.com/database/offseasonRecap?season=${internalNumber}`)
        .then((r) => r.json())
        .then((r) => r as BlaseballOffseasonRecap);

    const bonusResultsPromise = fetch(`https://blaseball.com/database/bonusResults?ids=${recap.bonusResults.join(",")}`)
        .then((r) => r.json())
        .then((r) => r as BlaseballBonusResult[]);

    const decreeResultsPromise = fetch(
        `https://blaseball.com/database/decreeResults?ids=${recap.decreeResults.join(",")}`
    )
        .then((r) => r.json())
        .then((r) => r as BlaseballDecreeResult[]);

    const eventResultsPromise = fetch(`https://blaseball.com/database/eventResults?ids=${recap.eventResults.join(",")}`)
        .then((r) => r.json())
        .then((r) => r as BlaseballEventResult[]);

    const [bonusResults, decreeResults, eventResults] = await Promise.all([
        bonusResultsPromise,
        decreeResultsPromise,
        eventResultsPromise,
    ]);

    return {
        props: {
            recap,
            bonusResults: Object.fromEntries(bonusResults.map((r) => [r.id, r])),
            decreeResults: Object.fromEntries(decreeResults.map((r) => [r.id, r])),
            eventResults: Object.fromEntries(eventResults.map((r) => [r.id, r])),
        },
    };
}

export default SeasonElectionPage;

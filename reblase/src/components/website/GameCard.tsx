import { GameState, GameTeam } from "blaseball-lib/games";
import { BlaseballGame } from "blaseball-lib/models";
import React from "react";

export interface GameCardProps extends BlaseballGame {}

export default function GameCard(props: GameCardProps) {
    return (
        <div>
            <div className="GameWidget-Header-Wrapper">
                <div className="GameWidget-Header">
                    <div className="GameWidget-StatusBar">
                        <div className="GameWidget-Status"></div>
                        <div className="WeatherIcon"></div>
                    </div>
                    <div className="GameWidget-ScoreLabel"></div>
                </div>
                <div className="GameWidget-ScoreBacking">
                    <div className="GameWidget-ScoreLine">
                        <div className="GameWidget-ScoreTeamColorBar"></div>
                        <div className="GameWidget-ScoreTeam">
                            <div className="GameWidget-ScoreName"></div>
                            <div className="GameWidget-ScoreTeamInfo"></div>
                        </div>
                        <div className="GameWidget-ScoreNumber"></div>
                    </div>
                </div>
            </div>
            <div className="GameWidget-Display-Visual">
                <div className="GameWidget-Display-Visual">
                    <div className="GameWidget-Display-Body">
                        <div className="GameWidget-Bases"></div>
                        <div className="GameWidget-Outs">
                            <div className="GameWidget-Outs-Row">
                                <div className="GameWidget-Outs-Label">Balls</div>
                                <div className="GameWidget-Outs-DotList">
                                    <div className="GameWidget-Outs-Dots">○</div>
                                </div>
                            </div>
                        </div>

                        <div className="GameWidget-AtBat">
                            <div className="GameWidget-PlayerLine">
                                <div className="GameWidget-PlayerStatusLabel">Pitching</div>
                                <div className="GameWidget-PlayerLineNameWrapper">
                                    <div className="GameWidget-PlayerLineName"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="GameWidget-Log">
                <div className="GameWidget-Log-Header">GAME LOG</div>
                <div className="GameWidget-Log-Content">{props.lastUpdate}</div>
            </div>
        </div>
    );
}

import React, { useMemo } from "react";
import { CellProps, Column, ColumnInstance, useSortBy, UseSortByColumnProps, useTable } from "react-table";
import { Loading } from "../components/Loading";
import Error from "../components/Error";
import { Container } from "../components/Container";
import { Stars } from "../components/Stars";
import { usePlayerTeamsList } from "../blaseball/hooks";
import { ChronPlayer } from "../blaseball/chronicler";

export function PlayersPage() {
    const { players, teamsObj, error, isLoading } = usePlayerTeamsList();

    const columns: Column<ChronPlayer>[] = useMemo(
        () => [
            {
                Header: "Team",
                id: "team",
                Cell: (props: CellProps<ChronPlayer>) => {
                    const teamId = props.row.original.teamId;
                    const team = teamId ? teamsObj[teamId] || null : null;

                    return <span>{team?.data?.shorthand ?? "NULL"}</span>;
                },
                cellClasses: ["text-center", "font-mono"],
            },
            {
                Header: "Name",
                id: "name",
                accessor: (p: ChronPlayer) => p.data.name,
            },
            {
                Header: "Position",
                id: "position",
                Cell: (props: CellProps<ChronPlayer>) => {
                    const { teamId, position, rosterIndex } = props.row.original;
                    const display = { lineup: "Batter", rotation: "Pitcher" };

                    if (!teamId || !teamsObj[teamId]) return <em>Hall</em>;
                    if (position === "lineup" || position === "rotation") {
                        return (
                            <span>
                                {display[position]} (#{rosterIndex! + 1})
                            </span>
                        );
                    } else {
                        return <em>Shadows</em>;
                    }
                },
                cellClasses: ["text-center"],
            },
            {
                Header: "Batting",
                id: "battingStars",
                Cell: (props: CellProps<ChronPlayer>) => {
                    return <Stars stars={props.row.original.stars?.batting ?? 0} />;
                },
            },
            {
                Header: "Pitching",
                id: "pitchingStars",
                Cell: (props: CellProps<ChronPlayer>) => {
                    return <Stars stars={props.row.original.stars?.pitching ?? 0} />;
                },
            },
            {
                Header: "Baserunning",
                id: "baserunningStars",
                Cell: (props: CellProps<ChronPlayer>) => {
                    return <Stars stars={props.row.original.stars?.baserunning ?? 0} />;
                },
            },
            {
                Header: "Defense",
                id: "defenseStars",
                Cell: (props: CellProps<ChronPlayer>) => {
                    return <Stars stars={props.row.original.stars?.defense ?? 0} />;
                },
            },
            {
                Header: "Modifiers",
                id: "attributes",
                Cell: (props: CellProps<ChronPlayer>) => {
                    const { gameAttr, weekAttr, seasAttr, permAttr } = props.row.original.data;
                    const attrs = [...(gameAttr ?? []), ...(weekAttr ?? []), ...(seasAttr ?? []), ...(permAttr ?? [])];

                    const display: Partial<Record<string, string>> = {};

                    return (
                        <span>
                            {attrs.map((a) => {
                                const text = display[a] ?? a;
                                return (
                                    <span key={a} className="tag tag-sm bg-gray-300">
                                        {text}
                                    </span>
                                );
                            })}
                        </span>
                    );
                },
            },
            {
                Header: "Status",
                id: "status",
                accessor: (player) => {
                    if (player.position === "bullpen" || player.position === "bench") return "\u{1F465}";
                    if (player.data.deceased) return "\u{1F525}";
                    return "\u{2714}";
                },
            },
        ],
        [teamsObj]
    );

    const data = useMemo(() => players ?? [], [players]);

    const table = useTable<ChronPlayer>(
        {
            columns,
            data,
            initialState: {
                sortBy: [{ id: "name", desc: false }],
            } as any,
        },
        useSortBy
    );

    if (error) return <Error>{error.toString()}</Error>;
    if (isLoading) return <Loading />;

    return (
        <Container>
            <table {...table.getTableProps()}>
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                        {(table.allColumns as (ColumnInstance<ChronPlayer> & UseSortByColumnProps<ChronPlayer>)[]).map(
                            (column) => (
                                <th className="px-4 py-2" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                </th>
                            )
                        )}
                    </tr>
                </thead>
                <tbody {...table.getTableBodyProps()}>
                    {table.rows.map((row) => {
                        table.prepareRow(row);
                        return (
                            <tr className="border-t border-b border-gray-300" {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            className={
                                                "px-2 py-1 " + ((cell.column as any).cellClasses ?? []).join(" ")
                                            }
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Container>
    );
}

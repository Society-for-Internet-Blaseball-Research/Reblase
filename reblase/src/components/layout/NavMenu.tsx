import React from "react";
import { Link } from "react-router-dom";
import { Container } from "./Container";
import { toggle as toggleColorScheme } from "../../blaseball/color-scheme";

export function NavMenu() {
    return (
        <div className="py-4 mb-2 bg-gray-200 dark:bg-gray-800">
            <Container>
                <div className="flex flex-row">
                    <div className="flex-1 text-lg font-semibold"><Link to="/">Reblase</Link></div>

                    <div className="space-x-8">
                        <button onClick={toggleColorScheme}>
                            <span className="dark:hidden">{"\u{1f303}"}<span className="sr-only">Dark mode</span></span>
                            <span className="hidden dark:inline">{"\u{1f307}"}<span className="sr-only">Light mode</span></span>
                        </button>
                        <Link to="/seasons">Seasons</Link>
                        <Link to="/events">
                            <span className="hidden sm:inline">Recent events</span>
                            <span className="sm:hidden">Events</span>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}

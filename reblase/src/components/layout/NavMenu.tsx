import React from "react";
import { Link } from "react-router-dom";
import { Container } from "./Container";

export function NavMenu() {
    return (
        <div className="py-4 mb-2 bg-gray-200">
            <Container>
                <div className="flex flex-row">
                    <div className="flex-1 text-lg font-semibold"><Link to="/">Reblase</Link></div>

                    <div className="space-x-8">
                        <Link to="/seasons">Seasons</Link>
                        <Link to="/events">Recent events</Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}

import React from 'react';
import {NavMenu} from './components/NavMenu';

export function PageLayout(props: { children: React.ReactNode }) {
    return (
        <div>
            <NavMenu/>

            {props.children}

            <div className="text-sm text-center my-4 italic text-gray-600">
                Brought to you by the {"\u{1f36c}"} Breath Mints.
                <br/>
                <a href="https://twitter.com/floofstrid">Author</a> (@Ske#6201) | <a href="https://github.com/xSke/BlaseballData">GitHub</a> | <a href="https://discord.gg/XKppCuj">SIBR Discord</a>g
            </div>
        </div>
    )
}

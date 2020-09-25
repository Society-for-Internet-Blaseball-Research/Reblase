import React from 'react';
import {Route, Switch} from 'react-router';
import {PageLayout} from './PageLayout';
import {SWRConfig} from 'swr'
import {GamePage} from "./pages/GamePage";
import {SeasonPage} from "./pages/SeasonPage";
import {Home} from "./pages/Home";
import {EventsPage} from "./pages/EventsPage";

export default function App() {
    return (
        <SWRConfig value={{fetcher: (...args) => fetch(...args).then(res => res.json())}}>
            <PageLayout>
                <Switch>
                    <Route path='/game/:gameId' component={GamePage}/>
                    <Route path='/season/:season' component={SeasonPage}/>
                    <Route path='/events' component={EventsPage}/>
                    <Route path='/' component={Home} />
                </Switch>
            </PageLayout>
        </SWRConfig>
    );
}
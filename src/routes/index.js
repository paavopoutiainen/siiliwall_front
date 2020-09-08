import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import BoardFromDb from '../pages/BoardFromDb'

export default function Routes() {
    const match = useRouteMatch('/boards/:id')
    
    return (
        <Switch>
            <Route exact path="/">
                <LandingPage />
            </Route>
            { match && 
                <Route exact path="/boards/:id">
                    <BoardFromDb id={match.params.id}/>
                </Route>
            }
        </Switch>
    )
}
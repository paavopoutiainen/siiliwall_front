import React, { useState, useEffect } from 'react'
import {
    Grid, FormControlLabel, Switch,
} from '@material-ui/core'
import Board from '../components/board/Board'
import SwimlaneView from '../components/swimlane/SwimlaneView'
import { boardPageStyles } from '../styles/styles'
import useBoardById from '../graphql/board/hooks/useBoardById'
import useBoardSubscriptions from '../graphql/subscriptions/useBoardSubscriptions'
import { client } from '../apollo'

const BoardPage = ({ id, eventId }) => {
    useEffect(() => () => {
        client.resetStore()
    }, [])
    const classes = boardPageStyles()
    const [view, toggleView] = useState('kanban')
    const queryResult = useBoardById(id)
    useBoardSubscriptions(id, eventId)

    if (queryResult.loading) return null
    const board = queryResult.data.boardById

    const switchView = () => {
        toggleView(view === 'kanban' ? 'swimlane' : 'kanban')
    }

    return (
        <Grid
            container
            direction="row"
            classes={{ root: classes.root }}
            id="boardElement"
        // spacing={3}
        >
            <Grid container item direction="column" justify="space-between" classes={{ root: classes.boardHeader }} id="boardHeader">
                <Grid item>
                    <h1>{board.name}</h1>
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Switch onChange={switchView} />}
                        label="Show swimlanes"
                        labelPlacement="end"
                    />
                </Grid>
            </Grid>

            <Grid item>
                {view === 'kanban' ? <Board board={board} /> : <SwimlaneView board={board} />}
            </Grid>
        </Grid>
    )
}
export default BoardPage

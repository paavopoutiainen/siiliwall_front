import React from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Grid, IconButton } from '@material-ui/core'
import { swimlaneStyles } from '../../styles/styles'
import DropdownTask from '../task/DropdownTask'

const SwimlaneHeaderRow = ({
    task, columnId, boardId, prettyId, title, numberOfSubtasks, handleShowClick, toggleEditTaskDialog,
}) => {
    const classes = swimlaneStyles()
    const handleDialogClick = (e) => e.stopPropagation()

    return (
        <Grid container item direction="row" classes={{ root: classes.swimlaneHeaderRow }} onClick={(e) => toggleEditTaskDialog(e)}>
            <Grid item container spacing={3} classes={{ root: classes.swimlaneHeaderRowLeft }}>
                <Grid item>
                    <IconButton
                        onClick={(e) => handleShowClick(e)}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </Grid>
                <Grid item><p style={{ color: '#3232FF' }}>{prettyId}</p></Grid>
                <Grid item><p>{title}</p></Grid>
            </Grid>
            <Grid item container spacing={3} classes={{ root: classes.swimlaneHeaderRowRight }} justify="flex-end">
                <Grid item>{numberOfSubtasks}</Grid>
                <Grid item classes={{ root: classes.taskDropdownButtonSwimlane }} onClick={(e) => handleDialogClick(e)}>
                    <DropdownTask
                        task={task}
                        columnId={columnId}
                        boardId={boardId}
                        calledFromSwimlane={true}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SwimlaneHeaderRow

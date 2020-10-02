/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'
import { boardPageStyles } from '../../styles/styles'
import DropdownTask from './DropdownTask'
import TaskEditDialog from './EditTaskDialog'

const Task = ({ task, index, columnId }) => {
    const classes = boardPageStyles()
    const { title } = task
    const titleLimit = 27
    const descrLimit = 20
    const [dialogStatus, setDialogStatus] = useState(false)
    const toggleDialog = () => setDialogStatus(!dialogStatus)
    const dots = '...'
    const add3Dots = (titleParam) => {
        let checkedTitle = titleParam
        if (titleParam.length > titleLimit) {
            checkedTitle = title.substring(0, titleLimit) + dots
        }
        return checkedTitle
    }

    const descrDots = (description) => {
        let retVal = description
        if (description.length > descrLimit) {
            retVal = description.substring(0, descrLimit) + dots
        }
        return retVal
    }

    const chosenMembersData = task.members.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <Grid
                    item
                    container
                    direction="column"
                    classes={{ root: classes.task }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Grid
                        item
                        container
                        direction="row"
                        justify="space-between"
                        classes={{ root: classes.taskInner }}
                    >
                        <Grid item>
                            <h3>{add3Dots(title)}</h3>
                            {task.owner ? (
                                <p>
                                    {`owner: ${task.owner.userName}`}
                                </p>
                            ) : null}
                            {task.size ? (
                                <p>
                                    {`size: ${task.size}`}
                                </p>
                            ) : null}
                            {task.members.length !== 0 ? (
                                <p>
                                    {`members:  ${chosenMembersData.map((user) => ` ${user.label}`)}`}
                                </p>
                            ) : null}
                            {task.description ? (
                                <p>
                                    {`description: ${descrDots(task.description)}`}
                                </p>
                            ) : null}
                        </Grid>
                        <Grid item>
                            <DropdownTask
                                taskId={task.id}
                                columnId={columnId}
                                handleEdit={toggleDialog}
                            />
                            <TaskEditDialog
                                dialogStatus={dialogStatus}
                                toggleDialog={toggleDialog}
                                editId={task.id}
                                task={task}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Draggable>
    )
}
export default Task

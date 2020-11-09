import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Grid, Button, Dialog, Checkbox,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { useMutation, useApolloClient } from '@apollo/client'
import { boardPageStyles } from '../styles/styles'
import { DELETE_COLUMN } from '../graphql/column/columnQueries'
import { COLUMNORDER_AND_COLUMNS } from '../graphql/fragments'
import { DELETE_TASK } from '../graphql/task/taskQueries'
import useArchiveTask from '../graphql/task/hooks/useArchiveTask'
import useArchiveSubtask from '../graphql/subtask/hooks/useArchiveSubtask'
import useDeleteSubtask from '../graphql/subtask/hooks/useDeleteSubtask'
import { removeTaskFromCache, deleteColumnFromCache, removeSubtaskFromCache } from '../cacheService/cacheUpdates'

const AlertBox = ({
    alertDialogStatus, toggleAlertDialog, action, columnId, boardId, taskId, subtaskId, count,
}) => {
    const [check, toggleCheck] = useState(false)
    const [archiveTask] = useArchiveTask()
    const [archiveSubtask] = useArchiveSubtask(columnId)
    const [callDeleteSubtask] = useDeleteSubtask(columnId)
    const classes = boardPageStyles()
    const client = useApolloClient()
    const [callDeleteColumn] = useMutation(DELETE_COLUMN)
    const [callDeleteTask] = useMutation(DELETE_TASK)
    const alertMsgDeleteColumn = 'This action will permanently remove the selected column and the tasks inside the column from your board and they can\'t be later examined! Are you sure you want to delete it?'
    const alertMsgDeleteTask = 'This action will permanently delete this task from the board and it can\'t be later examined! Are you sure you want to delete it?'
    const alertMsgArchiveTask = 'The task is removed from the board, but can be examined through the archive setting.'
    const alertMsgArchiveSubtask = 'The subtask is removed from the board, but can be examined through the archive setting.'
    const alertMsgDeleteSubtask = 'This action will permanently delete this task from the board and it can\'t be later examined! Are you sure you want to delete it?.'
    const alertMsgDeleteTaskIfSubtasks = `This task has ${count} unfinished subtask on the board! Deletion of the task will permanently remove all the subtasks as well!`
    const alertMsgArchiveTaskIfSubtasks = `This task has ${count} unfinished subtask on the board! Archiving of the task will also archive it's subtasks, but can be examined through the archive setting.`

    const eventId = window.localStorage.getItem('eventId')

    let alertMsg
    switch (action) {
    case 'DELETE_COLUMN':
        alertMsg = alertMsgDeleteColumn
        break
    case 'DELETE_TASK':
        alertMsg = alertMsgDeleteTask
        break
    case 'DELETE_TASK_IF_SUBTASKS':
        alertMsg = alertMsgDeleteTaskIfSubtasks
        break
    case 'ARCHIVE_TASK_IF_SUBTASKS':
        alertMsg = alertMsgArchiveTaskIfSubtasks
        break
    case 'ARCHIVE_TASK':
        alertMsg = alertMsgArchiveTask
        break
    case 'ARCHIVE_SUBTASK':
        alertMsg = alertMsgArchiveSubtask
        break
    case 'DELETE_SUBTASK':
        alertMsg = alertMsgDeleteSubtask
        break
    default:
        break
    }

    const WhiteCheckbox = withStyles({
        root: {
            color: 'white',
            '&$checked': {
                color: 'white',
            },
        },
        checked: {},
    })((props) => <Checkbox color="default" {...props} />)

    const handleChecked = () => {
        toggleCheck(!check)
    }

    const archiveSubtaskById = (subtaskId) => {
        archiveSubtask({
            variables: {
                subtaskId,
                columnId,
                boardId,
                eventId,
            },
        })
    }

    const archiveTaskById = () => {
        // Handle cache
        removeTaskFromCache(taskId, columnId, boardId)
        // Find the related subtasks and archive them
        const boardIdForCache = `Board:${boardId}`
        const columnData = client.readFragment({
            id: boardIdForCache,
            fragment: COLUMNORDER_AND_COLUMNS,
        })
        const columnsSubtasks = columnData.columns.map((column) => column.subtasks).flat()
        const subtasksToBeDeleted = columnsSubtasks.filter((subtask) => subtask.task.id === taskId)
        subtasksToBeDeleted.map((subtask) => archiveSubtaskById(subtask.id))
        // Send mutaion to the server
        archiveTask({
            variables: {
                taskId,
                columnId,
                boardId,
                eventId,
            },
        })
    }

    const deleteColumn = () => {
        deleteColumnFromCache(columnId, boardId)
        callDeleteColumn({
            variables: {
                columnId,
                boardId,
                eventId,
            },
        })
    }

    const deleteSubtask = (columnId, subtaskId) => {
        removeSubtaskFromCache(subtaskId, columnId)
        callDeleteSubtask({
            variables: {
                subtaskId,
                columnId,
                boardId,
                eventId,
            },
        })
    }

    const deleteTask = () => {
        removeTaskFromCache(taskId, columnId, boardId)
        // Handle deletion of task's subtasks
        const boardIdForCache = `Board:${boardId}`
        const columnData = client.readFragment({
            id: boardIdForCache,
            fragment: COLUMNORDER_AND_COLUMNS,
        })
        // Handle the removing of task's subtasks if they exist
        const columnsSubtasks = columnData.columns.map((column) => column.subtasks).flat()
        const subtasksToBeDeleted = columnsSubtasks.filter((subtask) => subtask.task.id === taskId)
        subtasksToBeDeleted.map((subtask) => deleteSubtask(subtask.column.id, subtask.id))
        callDeleteTask({
            variables: {
                taskId,
                columnId,
                boardId,
                eventId,
            },
        })
    }

    const handleDelete = () => {
        if (action === 'DELETE_TASK' || action === 'DELETE_TASK_IF_SUBTASKS') {
            deleteTask()
        }
        if (action === 'DELETE_COLUMN') {
            deleteColumn()
        }
        if (action === 'DELETE_SUBTASK') {
            deleteSubtask(columnId, subtaskId)
        }
    }

    const handleUndo = () => {
        toggleAlertDialog()
    }

    const handleArchive = () => {
        if (action === 'ARCHIVE_TASK' || action === 'ARCHIVE_TASK_IF_SUBTASKS') {
            archiveTaskById()
        }
        if (action === 'ARCHIVE_SUBTASK') {
            archiveSubtaskById(subtaskId)
        }
    }

    return (
        <Grid item>
            <Dialog
                classes={alertDialogStatus ? { root: classes.dialogFocus } : { root: classes.dialogUnfocus }}
                open={alertDialogStatus}
                onClose={toggleAlertDialog}
            >
                <Alert variant="filled" severity="error">
                    <Grid item container direction="column" spacing={2}>
                        <Grid item>
                            <span id="alertMessage">{alertMsg}</span>
                        </Grid>
                        {action === 'DELETE_TASK_IF_SUBTASKS' || action === 'ARCHIVE_TASK_IF_SUBTASKS'
                            ? (
                                <Grid item container direction="row" alignItems="center">
                                    <p>I understand</p>
                                    <WhiteCheckbox
                                        checked={check}
                                        onChange={handleChecked}
                                        size="small"
                                    />
                                </Grid>
                            )
                            : null}
                        <Grid item container direction="row" justify="flex-end">
                            <Button size="small" variant="contained" onClick={() => handleUndo()} classes={{ root: classes.undoAlertButton }}>
                                UNDO
                            </Button>
                            {action === 'DELETE_TASK' || action === 'DELETE_COLUMN' || action === 'DELETE_SUBTASK' || action === 'DELETE_TASK_IF_SUBTASKS'
                                ? (
                                    <Button
                                        size="small"
                                        color="secondary"
                                        variant="contained"
                                        onClick={() => handleDelete()}
                                        classes={{ root: classes.deleteAlertButton }}
                                        disabled={action === 'DELETE_TASK_IF_SUBTASKS' && !check}
                                    >
                                        DELETE
                                    </Button>
                                )
                                : null}
                            {action === 'ARCHIVE_TASK' || action === 'ARCHIVE_SUBTASK' || action === 'ARCHIVE_TASK_IF_SUBTASKS'
                                ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleArchive()}
                                        classes={{ root: classes.archiveAlertButton }}
                                        disabled={action === 'ARCHIVE_TASK_IF_SUBTASKS' && !check}
                                    >
                                        ARCHIVE
                                    </Button>
                                )
                                : null}
                        </Grid>
                    </Grid>
                </Alert>
            </Dialog>
        </Grid>
    )
}
export default AlertBox

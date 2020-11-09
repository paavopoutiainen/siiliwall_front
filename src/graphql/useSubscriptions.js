import { SUBTASK_REMOVED, SUBTASK_MUTATED } from './subtask/subtaskQueries'
import { TASK_MUTATED, TASK_REMOVED } from './task/taskQueries'
import { TICKET_MOVED_IN_COLUMN } from './ticket/ticketQueries'
import { COLUMN_DELETED } from './column/columnQueries'
import { useSubscription } from '@apollo/client'
import { removeSubtaskFromCache, removeTaskFromCache, addNewSubtask, addNewTask, cacheTicketMovedInColumn, deleteColumnFromCache } from '../cacheService/cacheUpdates'

const useSubscriptions = (id, eventId) => {
    useSubscription(COLUMN_DELETED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { columnId, boardId } = data.columnDeleted.removeInfo
                if (data.columnDeleted.removeType === 'DELETED') {
                    deleteColumnFromCache(columnId, boardId)
                }
            }
        }
    )
    useSubscription(SUBTASK_REMOVED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { subtaskId, columnId } = data.subtaskRemoved.removeInfo
                if (data.subtaskRemoved.removeType === 'DELETED') {
                    removeSubtaskFromCache(subtaskId, columnId)
                }
                else if (data.subtaskRemoved.removeType === 'ARCHIVED') {
                    removeSubtaskFromCache(subtaskId, columnId)
                }
            }
        }
    )
    useSubscription(TASK_REMOVED,
        {
            variables: { boardId: id },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { taskId, columnId, boardId } = data.taskRemoved.removeInfo
                // At some point these cases will probably be handled differently
                if (data.taskRemoved.removeType === 'DELETED') {
                    removeTaskFromCache(taskId, columnId, boardId)
                } else if (data.taskRemoved.removeType === 'ARCHIVED') {
                    removeTaskFromCache(taskId, columnId, boardId)
                }
            },
        }
    )
    useSubscription(TASK_MUTATED,
        {
            variables: { boardId: id },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                // At some point different kind of actions will be taken according to the mutationType
                // For example notifying the user that something got updated when mutationType is "UPDATED"
                // At the moment the values of the UPDATE subscription response are automatically
                // updated to the cache to the correct task entity
                if (data.taskMutated.mutationType === 'CREATED') {
                    addNewTask(data.taskMutated.node)
                }
            },
        }
    )
    useSubscription(SUBTASK_MUTATED,
        {
            variables: { boardId: id },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                if (data.subtaskMutated.mutationType === 'CREATED') {
                    addNewSubtask(data.subtaskMutated.subtask)
                }
            },
        }
    )
    useSubscription(TICKET_MOVED_IN_COLUMN,
        {
            variables: { boardId: id },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { columnId, newOrder } = data.ticketMovedInColumn
                cacheTicketMovedInColumn(columnId, newOrder)
            },
        }
    )
}
export default useSubscriptions
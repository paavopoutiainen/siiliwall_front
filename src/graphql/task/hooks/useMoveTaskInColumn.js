import { useMutation } from '@apollo/client'
import { MOVE_TICKET_IN_COLUMN } from '../taskQueries'

const useMoveTicketInColumn = () => {
    const retVal = useMutation(MOVE_TICKET_IN_COLUMN)
    return retVal
}

export default useMoveTicketInColumn

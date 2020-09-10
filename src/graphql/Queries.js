import { gql } from '@apollo/client'

export const GET_ALL_BOARDS = gql`
    query {
        allBoards {
           id
           name
        }
    }
`
export const GET_BOARD_BY_ID = gql`
    query findBoardById($boardId: ID!) {
        boardById(id: $boardId) {
            name
            columnOrder
            columns {
                id
                name
                tasks {
                    id
                    title
                }
            }
        }
    }
`
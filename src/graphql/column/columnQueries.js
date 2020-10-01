/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

export const ADD_COLUMN = gql`
    mutation addColumnForBoard($boardId: ID!, $columnName: String!) {
        addColumnForBoard(boardId: $boardId, columnName: $columnName) {
            id
            name
        }
    }
`

export const MOVE_COLUMN = gql`
    mutation moveColumn($orderArray: [ID!]!, $boardId: ID!) {
        moveColumn(boardId: $boardId, newColumnOrder: $orderArray)
    }
`

export const DELETE_COLUMN = gql`
    mutation deleteColumn($columnId: ID!) {
        deleteColumnById(id: $columnId)
    }
`
export const EDIT_COLUMN = gql`
    mutation editColumn($columnId: ID!, $columnName: String!) {
        editColumnById(id: $columnId, name: $columnName ) {
            id
            name
        }
    }
`

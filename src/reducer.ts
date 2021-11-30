import { Reducer } from 'redux'

import { COLLECTION_UPDATED, DOCUMENT_UPDATED, FirestoreAction } from './actions'

export type FirestoreState = Record<string, Record<string, unknown>>

const initialState: FirestoreState = {}

export const firestoreReducer: Reducer<FirestoreState> = (state = initialState, _action) => {
  const action = _action as FirestoreAction
  switch (action.type) {
    case COLLECTION_UPDATED: {
      return { ...state, [action.payload.key]: action.payload.dataGroup }
    }
    case DOCUMENT_UPDATED: {
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          [action.payload.id]: action.payload.data,
        },
      }
    }
    default: {
      return state
    }
  }
}

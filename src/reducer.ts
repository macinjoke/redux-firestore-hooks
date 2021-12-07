import { AnyAction } from 'redux'

import { COLLECTION_UPDATED, DOCUMENT_UPDATED, FirestoreAction } from './actions'

export type FirestoreState = Record<string, Record<string, unknown>>

export function createReducer<State extends FirestoreState>() {
  const firestoreReducer = (state: State = {} as any, _action: AnyAction): State => {
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
  return firestoreReducer
}

import { AnyAction } from 'redux'

import { COLLECTION_UPDATED, DOCUMENT_UPDATED, CLEAR, FirestoreAction } from './actions'

export type FirestoreState = Record<string, Record<string, unknown>>

/**
 * Create reducer for Firestore.
 * To specify State type, use generics.
 * @returns Reducer for Firestore action
 */
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
      case CLEAR: {
        const newState = state
        const { key, id } = action.payload
        if (id) {
          delete newState[key][id]
          return newState
        } else {
          delete newState[key]
          return newState
        }
      }
      default: {
        return state
      }
    }
  }
  return firestoreReducer
}

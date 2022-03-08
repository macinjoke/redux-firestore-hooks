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
        const { key, id } = action.payload
        if (id) {
          const { [id]: _, ...docs } = state[key]
          return { ...state, [key]: docs }
        } else {
          const { [key]: _, ...newState } = state
          // @ts-expect-error I'm right
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

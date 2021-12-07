import type { DocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import { useCallback } from 'react'
import type { Dispatch } from 'redux'

import { collectionUpdated, documentUpdated } from './actions'

/**
 * Return query snapshot handler.
 * The handler dispatches collectionUpdated action and the document data list will be updated.
 * @param dispatch Redux dispatch function
 * @returns query snapshot handler (return value of useCallback).
 */
export function useApplyCollection<Key extends string>(dispatch: Dispatch) {
  return useCallback(
    (key: Key) => {
      return (querySnapshot: QuerySnapshot): void => {
        const dataGroup = querySnapshot.docs.reduce((result, doc) => {
          return {
            ...result,
            [doc.id]: doc.data(),
          }
        }, {})
        dispatch(collectionUpdated({ key, dataGroup }))
      }
    },
    [dispatch],
  )
}

/**
 * Return document snapshot handler.
 * The handler dispatches documentUpdated action and the document data will be updated.
 * @param dispatch Redux dispatch function
 * @returns document snapshot handler (return value of useCallback).
 */
export function useApplyDocument<Key extends string>(dispatch: Dispatch) {
  return useCallback(
    (key: Key) => {
      return (docSnapshot: DocumentSnapshot): void => {
        const data = docSnapshot.data()
        dispatch(documentUpdated({ key, id: docSnapshot.id, data }))
      }
    },
    [dispatch],
  )
}

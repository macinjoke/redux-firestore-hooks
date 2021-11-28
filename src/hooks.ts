import type { DocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import { useCallback } from 'react'
import type { Dispatch, AnyAction } from 'redux'

export function useApplyCollection<Key extends string>(
  dispatch: Dispatch,
  actionCreator: (param: { key: Key; dataGroup: { [id in string]: unknown } }) => AnyAction,
) {
  return useCallback(
    (key: Key) => {
      return (querySnapshot: QuerySnapshot): void => {
        const dataGroup = querySnapshot.docs.reduce((result, doc) => {
          return {
            ...result,
            [doc.id]: doc.data(),
          }
        }, {})
        dispatch(actionCreator({ key, dataGroup }))
      }
    },
    [actionCreator, dispatch],
  )
}

export function useApplyDocument<Key extends string>(
  dispatch: Dispatch,
  actionCreator: (param: { key: Key; id: string; data: unknown }) => AnyAction,
) {
  return useCallback(
    (key: Key) => {
      return (docSnapshot: DocumentSnapshot): void => {
        const data = docSnapshot.data()
        dispatch(actionCreator({ key, id: docSnapshot.id, data }))
      }
    },
    [actionCreator, dispatch],
  )
}

import { DocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import { useCallback } from 'react'
import type { Dispatch, AnyAction } from 'redux'

export function useApplyCollection(
  dispatch: Dispatch,
  actionCreator: (param: { key: string; dataGroup: { [id in string]: unknown } }) => AnyAction,
) {
  return useCallback(
    (key: string) => {
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

export function useApplyDocument(
  dispatch: Dispatch,
  actionCreator: (param: { key: string; id: string; data: unknown }) => AnyAction,
) {
  return useCallback(
    (key: string) => {
      return (docSnapshot: DocumentSnapshot): void => {
        const data = docSnapshot.data()
        dispatch(actionCreator({ key, id: docSnapshot.id, data }))
      }
    },
    [actionCreator, dispatch],
  )
}

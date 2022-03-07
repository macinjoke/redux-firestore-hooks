const PREFIX = 'firestore/'

/**
 * Action type string for Firestore collection update
 */
export const COLLECTION_UPDATED = `${PREFIX}collectionUpdated` as const

/**
 * Action payload for Firestore collection update
 */
export type CollectionUpdatedPayload = { key: string; dataGroup: Record<string, unknown> }

/**
 * Action creator for Firestore collection update
 */
export function collectionUpdated(payload: CollectionUpdatedPayload): {
  type: typeof COLLECTION_UPDATED
  payload: CollectionUpdatedPayload
} {
  return {
    type: COLLECTION_UPDATED,
    payload,
  }
}

/**
 * Action type string for Firestore document update
 */
export const DOCUMENT_UPDATED = `${PREFIX}documentUpdated` as const

/**
 * Action payload for Firestore document update
 */
export type DocumentUpdatedPayload = { key: string; id: string; data: unknown }

/**
 * Action creator for Firestore document update
 */
export const documentUpdated = (
  payload: DocumentUpdatedPayload,
): {
  type: typeof DOCUMENT_UPDATED
  payload: DocumentUpdatedPayload
} => {
  return {
    type: DOCUMENT_UPDATED,
    payload,
  }
}

/**
 * Action type string for clearing Firestore data
 */
export const CLEAR = `${PREFIX}clear` as const

/**
 * Action payload for clearing Firestore data
 */
export type ClearPayload = { key: string; id?: string }

/**
 * Action creator for clearing Firestore data
 * @param payload
 *     If key string specified, delete its key collection.
 *     If key string and id string specified, delete its id document of its key collection.
 */
export const clear = (
  key: string,
  id?: string,
): {
  type: typeof CLEAR
  payload: ClearPayload
} => {
  return {
    type: CLEAR,
    payload: { key, id },
  }
}

/**
 * Action type for Firestore Actions
 */
export type FirestoreAction = ReturnType<
  typeof collectionUpdated | typeof documentUpdated | typeof clear
>

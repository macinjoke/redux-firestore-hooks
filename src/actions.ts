const PREFIX = 'firestore/'

export const COLLECTION_UPDATED = `${PREFIX}collectionUpdated` as const

export type CollectionUpdatedPayload = { key: string; dataGroup: Record<string, unknown> }

export function collectionUpdated(payload: CollectionUpdatedPayload): {
  type: typeof COLLECTION_UPDATED
  payload: CollectionUpdatedPayload
} {
  return {
    type: COLLECTION_UPDATED,
    payload,
  }
}

export const DOCUMENT_UPDATED = `${PREFIX}documentUpdated` as const

export type DocumentUpdatedPayload = { key: string; id: string; data: unknown }

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

export type FirestoreAction = ReturnType<typeof collectionUpdated | typeof documentUpdated>

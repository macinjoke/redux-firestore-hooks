# redux-firestore-hooks

FirestoreをサブスクライブしてReduxに反映させるためのシンプルな2つのユーティリティフックス。

[redux-firestore](https://github.com/prescottprue/redux-firestore) は覚えなければいけないライブラリのインタフェースが多く、Firestoreの知見があったとしてもそれなりの学習コストがかかるという欠点がある。redux-firestore-hooks ではなるべく素のfirestoreのインターフェースを使うようにしシンプルなI/Fにすることで導入・学習コストを下げることが利点。

しかし、作ってから思ったがライブラリにするにしては微妙なI/Fになりそうだ。なのでpublishもしてないが、サンプルコード的価値はあるかもなので残しておく。
# 使い方

```ts
// reduxFirestore.ts

import {
  useApplyCollection as useApplyCollection_,
  useApplyDocument as useApplyDocument_,
} from 'redux-firestore-hooks'

export function useApplyCollection() {
  const dispatch = useDispatch()
  return useApplyCollection_(dispatch, collectionUpdated)
}

export function useApplyDocument() {
  const dispatch = useDispatch()
  return useApplyDocument_(dispatch, documentUpdated)
}


// firestoreState.ts
// Redux Toolkit の書き方で書いているが、他の書き方でもok

export type User = {
  name: string
}

export type Chat = {
  userId: string
  text: string
  createdAt: string
}

export type State = {
  users: Record<string, User>
  chats: Record<string, Chat>
}

const initialState: State = {
  users: {},
  chats: {},
}

const firestoreSlice = createSlice({
  name: 'firestore',
  initialState,
  reducers: {
    collectionUpdated(
      state,
      action: PayloadAction<{ key: keyof State; dataGroup: Record<string, any> }>,
    ) {
      state[action.payload.key] = action.payload.dataGroup
    },
    documentUpdated(state, action: PayloadAction<{ key: keyof State; id: string; data: any }>) {
      state[action.payload.key][action.payload.id] = action.payload.data
    },
  },
})

// App.ts
import { collection, doc, onSnapshot, query } from 'firebase/firestore'

const App = ({ userId }) => {
  const applyDocument = useApplyDocument()
  const applyCollection = useApplyCollection()

  // Appマウント時にchatsコレクションをサブスクライブしfirestore.chats stateに反映させる
  useEffect(() => {
    const unsubscribeChats = onSnapshot(query(collection(db, 'chats')), applyCollection('chats'))
    return () => {
      unsubscribeChats()
    }
  }, [applyCollection])

  // userIdに応じてusersドキュメントをサブスクライブしてfirestore.users stateに反映させる
  useEffect(() => {
    const unsubscribeUser = onSnapshot(doc(db, `users/${userId}`), applyDocument('users'))
    return () => {
      unsubscribe()
    }
  }, [applyDocument])
}
```

# redux-firestore-hooks

FirestoreをサブスクライブしてReduxに反映させるためのシンプルなツール。
アクションを発行する2つのReactカスタムフックとReducerを提供する。

(時間がなく、日本語ドキュメントのみ作成。モチベあれば英語ドキュメントを作成する)

## Motivation

似たライブラリとして [redux-firestore](https://github.com/prescottprue/redux-firestore) はFirestoreをラップした高度なAPIを提供しているため新たにそれらのAPIを覚えなくてはならない。それゆえFirestoreの知見があったとしても理解しずらいという欠点がある。また、バンドルサイズも大きい。

redux-firestore-hooks では素のFirestoreのインターフェースを使いつつReduxと連携できるシンプルなI/Fを採用することで導入・学習コストを下げることができる。

## Install

```shell
npm install redux-firestore-hooks
```

## 使い方

store.ts

```ts
// Redux Toolkit の書き方で書いているが他の書き方でもok

import { configureStore } from '@reduxjs/toolkit'
import { createReducer } from 'redux-firestore-hooks'

// Firestore の ドキュメントの型
export type User = {
  displayName: string
  photoURL: string
}

// Firestore の ドキュメントの型
export type Chat = {
  userId: string
  text: string
}

// idにはドキュメントのidが入る
type FirestoreState = {
  users?: { [id in string]: User }
  chats?: { [id in string]: Chat }
}

const store = configureStore({
  reducer: {
    // firestore stateの型を効かすにはここで型を入れる。
    firestore: createReducer<FirestoreState>(),
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
```

App.tsx

```ts
// App.tsx
import { collection, doc, onSnapshot, query } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { useApplyCollection, useApplyDocument, clear } from 'redux-firestore-hooks'

const App = ({ userId }) => {
  const dispatch = useDispatch()
  const applyDocument = useApplyDocument(dispatch)
  const applyCollection = useApplyCollection(dispatch)

  // Appマウント時にchatsコレクションをサブスクライブしfirestore.chats stateに反映させる
  useEffect(() => {
    const unsubscribeChats = onSnapshot(query(collection(db, 'chats')), applyCollection('chats'))
    return () => {
      unsubscribeChats()
      // clear chats data
      dispatch(clear('chats'))
    }
  }, [applyCollection])

  // userIdに応じてusersドキュメントをサブスクライブしてfirestore.users stateに反映させる
  useEffect(() => {
    const unsubscribeUser = onSnapshot(doc(db, `users/${userId}`), applyDocument('users'))
    return () => {
      unsubscribe()
      // clear user data by userId
      dispatch(clear(['users', userId]))
    }
  }, [userId, applyDocument])

  return null
}
```

Appコンポーネントがマウントされ、Firestoreへのサブスクライブが完了したときのReduxのstateは以下のようになる。

```ts
{
  firestore: {
    users: {
      xj0cjs: {
        displayName: 'Alice'
        photoURL: 'https://example.com/alice.png'
      },
    }
    chats: {
      fajei8: {
        userId: 'xj0cjs',
        text: 'こんにちは、Bob',
      },
      d8cjs2: {
        userId: 'f82bma',
        text: 'こんにちは、Alice',
      }
    }
  }
}
```



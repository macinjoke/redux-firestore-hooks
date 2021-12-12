# redux-firestore-hooks

A simple tool for subscribing to Firestore and reflecting it in Redux.

It provides:
- Two custom hooks dispatching an action for Firestore data.
- Reducer receiving these actions.

## Motivation

A similar Library is [redux-firestore](https://github.com/prescottprue/redux-firestore), which provides an API that wraps Firestore.
So you have to learn those APIs anew. Therefore, even if you have knowledge of Firebase SDK I/F, it is difficult to understand.
In addition, the bundle size is large.

redux-firestore-hooks adopt the design that directly use Firebase SDK I/F. So you can learn easily and keep code simple.

## Install

```shell
npm install redux-firestore-hooks
```

## Usage

store.ts

```ts
// Writing for Redux Toolkit, but you can write other type store.

import { configureStore } from '@reduxjs/toolkit'
import { createReducer } from 'redux-firestore-hooks'

// type for Firestore document
export type User = {
  displayName: string
  photoURL: string
}

// type for Firestore document
export type Chat = {
  userId: string
  text: string
}

// id is document ID
type FirestoreState = {
  users?: { [id in string]: User }
  chats?: { [id in string]: Chat }
}

const store = configureStore({
  reducer: {
    // To work firestore state type, put the type here.
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

  // When App is mounted, subscribing chats and reflecting it in firestore.chats state
  useEffect(() => {
    const unsubscribeChats = onSnapshot(query(collection(db, 'chats')), applyCollection('chats'))
    return () => {
      unsubscribeChats()
      // clear chats data
      dispatch(clear('chats'))
    }
  }, [applyCollection])

  // Subscribe to the user document as the userId changes and reflect it in firestore.users state
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

When the App component is mounted and the subscription to the Firestore is complete, Redux's state will be: 

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
        text: 'Hello, Bob',
      },
      d8cjs2: {
        userId: 'f82bma',
        text: 'Hello, Alice',
      }
    }
  }
}
```



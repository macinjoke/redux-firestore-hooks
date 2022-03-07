import { createReducer, clear, collectionUpdated, documentUpdated } from '.'

test('collectionUpdated', () => {
  const payload1 = {
    key: 'foo',
    dataGroup: {
      x: { x1: 'x1 text', x2: 11 },
      y: { y1: true, y2: null },
    },
  }
  const payload2 = {
    key: 'foo',
    dataGroup: {},
  }
  const reducer = createReducer()

  const initialState = {}

  const state1 = reducer(initialState, collectionUpdated(payload1))
  expect(state1).toMatchSnapshot()
  const state2 = reducer(state1, collectionUpdated(payload2))
  expect(state2).toMatchSnapshot()
})

test('documentUpdated', () => {
  const payload1 = {
    key: 'foo',
    id: 'id1',
    data: {
      x1: 'x1 text',
      x2: 11,
    },
  }
  const payload2 = {
    key: 'foo',
    id: 'id1',
    data: {},
  }
  const reducer = createReducer()

  const initialState = {}

  const state1 = reducer(initialState, documentUpdated(payload1))
  expect(state1).toMatchSnapshot()
  const state2 = reducer(state1, documentUpdated(payload2))
  expect(state2).toMatchSnapshot()
})

test('clear', () => {
  const reducer = createReducer()

  const initialState = {
    foo: {
      x: {
        x1: 'x1 text',
        x2: 11,
      },
      y: {
        y1: true,
      },
      z: {
        z1: null,
      },
    },
  }

  const state1 = reducer(initialState, clear(['foo', 'x']))
  expect(state1).toMatchSnapshot()
  const state2 = reducer(state1, clear('foo'))
  expect(state2).toMatchSnapshot()
})

import {describe, expect, test} from '@jest/globals';
import {requestReducer} from './useAiRequest'


describe('requestReducer', ()=> {
    test("проверка статуса", ()=> {
        expect(requestReducer({status: "idle", result: ""}, {type: 'start'})).toEqual({ status: "loading", result: ""})
    })
})


describe('requestReducer', ()=> {
    test("проверка статуса", ()=> {
        expect(requestReducer({status: "loading", result: "васап "}, {type: 'chunk', payload: "привет"})).toEqual({ status: "loading", result: "васап привет"})
    })
})


describe('requestReducer', ()=> {
    test("проверка статуса", ()=> {
        expect(requestReducer({status: "success", result: "васап"}, {type: 'done',})).toEqual({ status: "success", result: "васап"})
    })
})
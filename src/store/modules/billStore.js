//帐单列表相关store

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const billStore = createSlice({
    // 数据状态state
    name: 'bill',
    initialState: {
        billList: []
    },
    reducers: {
        // 同步修改方法
        setBillList(state, action) {
            state.billList = action.payload
        },
        addBill(state,action){
            state.billList.push(action.payload)
        }
    }
})

// 解构actionCreate函数
const { setBillList , addBill } = billStore.actions

// 编写异步
const getBillList = () => {
    return async (dispatch) => {
        // 编写异步请求
        const res = await axios.get('http://localhost:8888/ka')
        // 触发同步reducer
        dispatch(setBillList(res.data))

    }
}

const addBillList = (data) => {
    return async (dispatch) => {
        const res = await axios.post('http://localhost:8888/ka',data)
        dispatch(addBill(res.data))
    }
}

const reducer = billStore.reducer
export { getBillList , addBillList }
export default reducer
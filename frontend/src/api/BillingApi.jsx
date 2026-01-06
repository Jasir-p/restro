import axiosAuthInterceptor from "../interceptors/axiosAuthInterceptor";



export const generateBill = async (table_id,order_id)=>{
    const response = await axiosAuthInterceptor.post('/api/billing/create/',
        {
            'table':table_id,
            'order':order_id
        }
    )
    return response
}

export const fetchTodayBill = async()=>{
    const response = await axiosAuthInterceptor.get('/api/billing/lists/today/')   
    return response.data
}


export const fetchSingleBill = async(bill_id)=>{
        const response = await axiosAuthInterceptor.get(`/api/billing/detail/${bill_id}/`)
        return response.data
}

export const requestBill = async(table_id)=>{
      const response = await axiosAuthInterceptor.post(`/api/billing/request/${table_id}/`)
      return response.data
}

export const billStatusChaneg = async(bill_id,status)=>{
    const response = await axiosAuthInterceptor.patch(`/api/billing/${bill_id}/status/`,
        {"status":status}
    )
    return response.data
}
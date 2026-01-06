import axiosAuthInterceptor from "../interceptors/axiosAuthInterceptor"


export const fetchOrderbyTable = async(table_id) =>{

    const response = await axiosAuthInterceptor.get(`/api/orders/${table_id}/`)
    console.log(response);
    
    return response

}

export const createOrder = async(formData) =>{
    const response = await axiosAuthInterceptor.post('/api/orders/',formData)
}
export const updateOrderStatusApi = async (order_id,status)=>{
    const response = await axiosAuthInterceptor.patch(`/api/orders/${order_id}/change-status/`,
        {'status':status}
    )
    return response.data
}

export const fetchOrderItems = async(order_id) =>{
    const response = await axiosAuthInterceptor.get(`/api/orders/${order_id}/order-items/`)
    return response.data
}

export const updateOrderItems = async(item_id,qty) =>{
    const data ={
        "quantity":qty
    }
    const response = await axiosAuthInterceptor.patch(`/api/orders/${item_id}/update-items/`,
        data,
    )
    return response.data
}
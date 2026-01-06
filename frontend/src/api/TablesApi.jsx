import axiosAuthInterceptor from "../interceptors/axiosAuthInterceptor";

export const fetchTables = async ()=>{

        const response = await axiosAuthInterceptor.get('/api/tables/')
        return response.data
    
}

export const addTableApi = async (formData)=>{

const response = await axiosAuthInterceptor.post('/api/tables/',formData)
return response.data
}

export const editTableApi = async (formData,table_id) =>{
    const response = await axiosAuthInterceptor.patch(`/api/tables/${table_id}/`,formData)
    return response.data
}

export const removeTableApi = async (table_id) =>{
    const response = await axiosAuthInterceptor.delete(`/api/tables/${table_id}/`)
    return response
}

export const tabelStatusChangeApi = async(table_id,status) =>{
    const response = await axiosAuthInterceptor.patch(`/api/tables/${table_id}/status/`,
        {status}
    )
    return response.data
}
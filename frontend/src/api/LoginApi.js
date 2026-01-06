import axios from "axios";

export  const LoginApi = async(formData)=>{
    try{
        const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/workers/sign-in/`,
                formData,
                );
        return response.data
    }
    catch(error){
        if (error.response){
            throw error.response.data
        }
        else{
            throw new Error("something went wrong")
        }

    }
}


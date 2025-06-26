import { toast } from "react-toastify"
import summaryApi from "../common"

const addToCart = async(e, id)=>{
    e?.stopPropagation()
    e?.preventDefault()
    const response = await fetch(summaryApi.addToCart.url,{
        method: summaryApi.addToCart.method,
        credentials: 'include',
        headers:{
            "content-type" : 'application/json'
        },
        body : JSON.stringify({
            productId : id
    })
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData.message)

    }
    if(responseData.error){
        toast.error(responseData.message)

    }
}

export default addToCart
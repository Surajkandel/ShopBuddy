const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDDINARY}/image/upload`
const uploadImage = async(image) =>{
    const formData = new formData()
    const dataResponse = await fetch(url,{
        

        method : 'post',
        body : ''
        
    }
    )
}

export default uploadImage

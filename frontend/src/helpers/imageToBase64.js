const imageToBase64 = async(image)=>{
    const reader = new FileReader()

    const data = await new Promise((resolve, rejet)=>{
        reader.onload = () => resolve(reader.result)

        reader.onerror = error => rejet(error)
    })
    return data

}
export default imageToBase64
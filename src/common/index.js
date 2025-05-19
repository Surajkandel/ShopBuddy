const backendDomain = "http://localhost:8080"

const summaryApi = {
    signup : {
        url : `${backendDomain}/api/signup`,
        method : "post"
    },
    signin : {
        url : `${backendDomain}/api/signin`,
        method : "post"
    }
}

export default summaryApi
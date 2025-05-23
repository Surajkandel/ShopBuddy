const backendDomain = "http://localhost:8080"

const summaryApi = {
    signup : {
        url : `${backendDomain}/api/signup`,
        method : "post"
    },
    signin : {
        url : `${backendDomain}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomain}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : 'get'
    },
    allUsers : {
        url : `${backendDomain}/api/all-users`,
        method : 'get'
    },
    allProducts : {
        url : `${backendDomain}/api/all-products`,
        method : 'get'
    }
}

export default summaryApi
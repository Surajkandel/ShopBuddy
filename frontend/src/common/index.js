const backendDomain = "http://localhost:8080"

const summaryApi = {
    signup: {
        url: `${backendDomain}/api/signup`,
        method: "post"
    },
    sellersignup: {
        url: `${backendDomain}/api/sellersignup`,
        method: "post"
    },
    signin: {
        url: `${backendDomain}/api/signin`,
        method: "post"
    },
    current_user: {
        url: `${backendDomain}/api/user-details`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomain}/api/userLogout`,
        method: 'get'
    },
    allUsers: {
        url: `${backendDomain}/api/all-users`,
        method: 'get'
    },
    allProducts: {
        url: `${backendDomain}/api/all-products`,
        method: 'get'
    },
    addProduct: {
        url: `${backendDomain}/api/add-product`,
        method: "post"
    },
    updateProduct: {
        url: `${backendDomain}/api/update-product`,
        method: "post"
    },

    allProduct: {
        url: `${backendDomain}/api/get-product`,
        method: "get"

    },
    categoryProduct: {
        url: `${backendDomain}/api/get-CategoryProduct`,
        method: "get"

    },
    categoryWiseProduct: {
        url: `${backendDomain}/api/product-by-category`,
        method: "post"
    },
    productDetails: {
        url: `${backendDomain}/api/productdetails`,
        method: "get"
    },
    addToCart: {
        url: `${backendDomain}/api/addtocart`,
        method: "post"
    },
    countAddToCartProduct: {
        url: `${backendDomain}/api/countaddtocartproduct`,
        method: "post"
    },
    viewAddToCartProduct: {
        url: `${backendDomain}/api/view-add-to-cart-product`,
        method: 'get'
    },
    removeFromCart: {
        url: `${backendDomain}/api/remove-from-cart`,
        method: 'post'
    },
    updateCartProduct: {
        url: `${backendDomain}/api/update-cart-product`,
        method: 'post'
    },
    getCartProducts: {
        url: `${backendDomain}/api/getcartproducts`,
        method: "get"
    }, searchProduct : {
        url : `${backendDomain}/api/search`,
        method : 'get'
    }


}

export default summaryApi
import React, { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEyeSlash, FaRegEye, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import uploadImage from '../helpers/uploadImage';
import summaryApi from '../common';

const SellerSignup = () => {
    const {userId} = useParams()
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState({

        profilePic: "",
        shopName: "",
        address: "",
        phone: "",
        identityProof: "",
        businessLicense: ""
    });

    const profilePicRef = useRef(null);
    const identityProofRef = useRef(null);
    const businessLicenseRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (file, fieldName) => {
        if (!file) return;

        try {
            setUploading(true);
            const uploadResult = await uploadImage(file);
            setData(prev => ({ ...prev, [fieldName]: uploadResult.url }));
            toast.success(`${fieldName} uploaded successfully`);
        } catch (error) {
            toast.error(`Failed to upload ${fieldName}`);
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!data.shopName ||
            !data.address || !data.phone || !data.identityProof || !data.businessLicense) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            
            const dataResponce = await fetch(`${summaryApi.sellersignup.url}/${userId}`, {
                method: summaryApi.sellersignup.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)


            })

            const dataApi = await dataResponce.json()

            if (dataApi.success) {
                toast.success(dataApi.message)
                navigate('/seller-pannel/all-products')

            }
            if (dataApi.error) {
                toast.error(dataApi.message)

            }


        

      

       
       
    } catch (error) {
        toast.error("Network error. Please try again.");
        console.error(error);
    }
};

return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create Seller Account
            </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>




                    {/* Shop Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Shop Name *
                        </label>
                        <input
                            type="text"
                            name="shopName"
                            value={data.shopName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Shop Address *
                        </label>
                        <textarea
                            name="address"
                            value={data.address}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={data.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Profile Picture */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Shop Logo
                        </label>
                        <input
                            type="file"
                            ref={profilePicRef}
                            onChange={(e) => handleFileUpload(e.target.files[0], 'profilePic')}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => profilePicRef.current.click()}
                            className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={uploading}
                        >
                            <FaCloudUploadAlt className="mr-2" />
                            {data.profilePic ? "Change Profile Picture" : "Upload Profile Picture"}
                        </button>
                        {data.profilePic && (
                            <div className="mt-2 flex justify-center">
                                <img src={data.profilePic} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Identity Proof */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Identity Proof (Government ID) *
                        </label>
                        <input
                            type="file"
                            ref={identityProofRef}
                            onChange={(e) => handleFileUpload(e.target.files[0], 'identityProof')}
                            accept="image/*,.pdf"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => identityProofRef.current.click()}
                            className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={uploading}
                        >
                            <FaCloudUploadAlt className="mr-2" />
                            {data.identityProof ? "Identity Proof Uploaded" : "Upload Identity Proof"}
                        </button>
                    </div>

                    {/* Business License */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Business License *
                        </label>
                        <input
                            type="file"
                            ref={businessLicenseRef}
                            onChange={(e) => handleFileUpload(e.target.files[0], 'businessLicense')}
                            accept="image/*,.pdf"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => businessLicenseRef.current.click()}
                            className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={uploading}
                        >
                            <FaCloudUploadAlt className="mr-2" />
                            {data.businessLicense ? "Business License Uploaded" : "Upload Business License"}
                        </button>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {uploading ? 'Processing...' : 'Register as Seller'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>

                    </div>


                </div>
            </div>
        </div>
    </div>
);
};

export default SellerSignup;
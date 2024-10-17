import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEmployeeStore } from '../store/employeeStore';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyAccount = () => {
    const {verifyAccount} = useEmployeeStore();
    const {token} = useParams();
    const navigate = useNavigate();
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [showPassword,setShowPassword] = useState(false);

    const validateForm = () => {
        const validationErrors = [];
        if(!newPassword){
            validationErrors.push('New password is required.');
        }else if(!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(newPassword)){
            validationErrors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }
        if(!confirmPassword){
            validationErrors.push('Confirm password is required.');
        }else if(newPassword !== confirmPassword){
            validationErrors.push('Passwords do not match.');
        }
        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setLoading(true);

        try {
            const success = await verifyAccount(token, newPassword, confirmPassword);
            if(success){
                toast.success('Password reset successfully!');
                setNewPassword('');
                setConfirmPassword('');
                            setTimeout(() => {
                navigate('/login');
            }, 5000);
            }else{
                toast.error('Token is expired!');
            }
        } catch (error) {
          console.error("Error during password reset:", error);
          if(error.response){
              toast.error(error.response.data.message || 'An error occurred. Please try again later.');
          }else{
              toast.error('An error occurred. Please try again later.');
          }
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=> {
        document.title = 'Verify Account';
    });

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Verify Your Account</h2>
                <p>Create new password to verify your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">New Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button type="button" onClick={() => setShowPassword(prev => !prev)} className="mb-4 text-blue-600 hover:underline">
                        {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                    </button>
                    <button type="submit" className={`w-full py-2 px-4 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-md hover:bg-blue-700`} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default VerifyAccount;
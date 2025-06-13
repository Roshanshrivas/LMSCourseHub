import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setUser } from '@/redux/authSlice'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
       const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
       })
       if (response?.data?.success) {
        navigate("/")
        dispatch(setUser(response?.data?.user));
        toast.success(response?.data?.message || 'Login successful');
       }else{
        toast.error(response?.data?.message || 'Login failed');
       }
    } catch (error) {
      console.error("Error in login:", error);
      toast.error(error?.response?.data?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 md:mt-5">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please Login to your account
        </p>
        <div className="mb-4">
          <Label>Email Address</Label>
          <Input 
          placeholder="Enter Your Email" 
          type="email"
          name="email" 
          value={input.email} 
          onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <Label>Password</Label>
          <Input 
          placeholder="Enter Your Password" 
          type="password"
          name="password" 
          value={input.password} 
          onChange={handleChange}
          />
        </div>

      <Button 
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 w-full mb-2 hover:bg-blue-600">
      {
        loading ? (
          <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
          </span>
        ) : (
          'Login'
        )
      }
      </Button>
        
        
        {/* Divider  */}
        <div className='flex items-center my-6'>
            <hr className='flex-grow border-gray-300'/>
            <span className='mx-3 text-gray-500'>OR</span>
            <hr className='flex-grow border-gray-300'/>
        </div>
        <p className='text-center'>Don't have an account? <Link to={"/signup"} className="text-blue-500 hover:underline">Signup</Link></p>
      </div>
    </div>
  )
}

export default Login
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
       const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`, user, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
       })
       if (response?.data?.success) {
         toast.success(response?.data?.message || "Signup Successfull");
         navigate("/login");
       } else{
        toast.error(response?.data?.message || "Signup failed");
       }
    } catch (error) {
      console.error("Error in signup:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 md:mt-5">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join us today! It's quick and easy
        </p>
        {/* Name input  */}
        <div className="mb-4">
          <Label>Full Name</Label>
          <Input placeholder="Enter Your Name" 
          name="name"
          value={user.name}
          onChange={handleChange}
          type="text"
          id="name"
          />
        </div>
        <div className="mb-4">
          <Label>Email Address</Label>
          <Input placeholder="Enter Your Email" 
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <Label>Password</Label>
          <Input placeholder="Enter Your Password"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <Label>Role</Label>
          <RadioGroup className="flex gap-4 mt-2 peer">
            <div className="flex items-center space-x-2">
              <Input 
              type="radio"
              id="role1"
              name="role"
              value="student"
              checked={user.role === "student"}
              onChange={handleChange} 
              />
              <Label htmlFor="role1">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input 
              type="radio"
              id="role2"
              name="role"
              value="instructor"
              checked={user.role === "instructor"}
              onChange={handleChange} 
              />
              <Label htmlFor="role2">Instructor</Label>
            </div>
          </RadioGroup>
        </div>
        <Button 
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 w-full mb-2 hover:bg-blue-600" >
          {
            loading ? (
              <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </span>
            ) : (
              "Sign Up"
            )
          }
        </Button>
        <p className="text-center">Already have an account? <Link to={"/login"} className="text-blue-500 hover:underline">Log in</Link></p>
      </div>
    </div>
  );
};

export default Signup;

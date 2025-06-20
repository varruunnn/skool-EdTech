import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Mail, User, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface RegisterResponse {
  message: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
  terms: boolean;
  class?: number; // Add class field, optional
  schoolId: string; // Add schoolId field
}

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentClass, setStudentClass] = useState<number | undefined>(undefined);
  const [schoolId, setSchoolId] = useState(""); // State for schoolId
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    terms: "",
    class: "",
    schoolId: "", // Add error field for schoolId
  });

  const navigate = useNavigate();

  // Validate form
  const validate = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: '',
      terms: '',
      class: '',
      schoolId: '', // Validation for schoolId
    };
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!userType) {
      newErrors.userType = 'User type is required';
      isValid = false;
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms';
      isValid = false;
    }

    if (userType === 'student' && !studentClass) {
      newErrors.class = 'Class is required for students';
      isValid = false;
    }

    if (!schoolId.trim()) {
      newErrors.schoolId = 'School ID is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await axios.post<RegisterResponse>("http://localhost:3001/api/auth/register", {
        name: fullName,
        email,
        password,
        role: userType,
        schoolId, // Send schoolId
        class: userType === 'student' ? studentClass : undefined, // Send class only if the user is a student
      });

      toast.success(res.data.message || "Registration successful!");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div className="space-y-2">
        <Label
          htmlFor="fullName"
          className="text-sm font-medium text-black-200"
        >
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-black-400" />
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className={`pl-10 bg-black-800/50 border-[1px] border-black text-white placeholder:text-black-400 focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.fullName ? "border-red-500 focus:border-red-500" : ""
            }`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-black-200">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-black-400" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className={`pl-10 bg-black-800/50 border-[1px] border-black text-white placeholder:text-black-400 focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.email ? "border-red-500 focus:border-red-500" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      {/* School ID */}
      <div className="space-y-2">
        <Label
          htmlFor="schoolId"
          className="text-sm font-medium text-black-200"
        >
          School ID
        </Label>
        <div className="relative">
          <Input
            id="schoolId"
            type="text"
            placeholder="Enter your school ID"
            className={`pl-10 bg-black-800/50 border-[1px] border-black text-white placeholder:text-black-400 focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.schoolId ? "border-red-500 focus:border-red-500" : ""
            }`}
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {errors.schoolId && (
          <p className="text-red-400 text-xs mt-1">{errors.schoolId}</p>
        )}
      </div>
      {/* User Type */}
      <div className="space-y-2">
        <Label
          htmlFor="userType"
          className="text-sm font-medium text-black-200"
        >
          I am a
        </Label>
        <Select
          value={userType}
          onValueChange={setUserType}
          disabled={isLoading}
        >
          <SelectTrigger
            id="userType"
            className={`bg-black-800/50 border-[1px] border-black text-white focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.userType ? "border-red-500 focus:border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent className="bg-black-800 border-black-700">
            <SelectItem
              value="student"
              className="text-white hover:bg-black-700"
            >
              Student
            </SelectItem>
            <SelectItem
              value="teacher"
              className="text-white hover:bg-black-700"
            >
              Teacher
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.userType && (
          <p className="text-red-400 text-xs mt-1">{errors.userType}</p>
        )}
      </div>
      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="register-password"
          className="text-sm font-medium text-black-200"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-black-400" />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className={`pl-10 pr-10 bg-black-800/50 border-[1px] border-black text-white placeholder:text-black-400 focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.password ? "border-red-500 focus:border-red-500" : ""
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-black-400 hover:text-black-200 transition-colors"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password}</p>
        )}
      </div>
      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirm-password"
          className="text-sm font-medium text-black-200"
        >
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-black-400" />
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className={`pl-10 pr-10 bg-black-800/50 border-[1px] border-black text-white placeholder:text-black-400 focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.confirmPassword
                ? "border-red-500 focus:border-red-500"
                : ""
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-black-400 hover:text-black-200 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {userType === "student" && (
        <div className="space-y-2">
          <Label htmlFor="class" className="text-sm font-medium text-black-200">
            Select Class
          </Label>
          <div className="relative">
            <Select
              value={studentClass?.toString()} // Convert to string
              onValueChange={(value) => setStudentClass(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger
                id="class"
                className={`bg-black-800/50 border-[1px] border-black text-white focus:border-indigo-500 focus:ring-indigo-500/20 ${
                  errors.class ? "border-red-500 focus:border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent className="bg-black-800 border-black-700">
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white hover:bg-black-700">
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.class && (
              <p className="text-red-400 text-xs mt-1">{errors.class}</p>
            )}
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="h-4 w-4 rounded border-black-600 bg-black-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-black-900 mt-0.5"
          />
          <Label
            htmlFor="terms"
            className="text-sm text-black-300 cursor-pointer leading-relaxed"
          >
            I agree to the{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-red-400 text-xs mt-1">{errors.terms}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 transition-all duration-200 ${
          isLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:shadow-indigo-600/30 hover:scale-[1.02]"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">Creating account</span>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          </div>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;

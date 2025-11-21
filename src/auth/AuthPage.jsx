import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, Github, Twitter, Facebook, AlertCircle } from "lucide-react";
import { useAuthStore, useUIStore } from "../stores";

const AuthPage = () => {
  const navigate = useNavigate();
  
  // Zustand stores
  const { 
    login, 
    signup, 
    loading, 
    error, 
    clearError,
    isAuthenticated 
  } = useAuthStore();
  
  const { 
    activeTab, 
    setActiveTab,
    addNotification 
  } = useUIStore();
  
  // Local form state (can also be moved to store if needed)
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
    company: ""
  });
  
  const [errors, setErrors] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: ""
  });
  
  const [touched, setTouched] = useState({
    userName: false,
    password: false,
    confirmPassword: false,
    fullName: false,
    email: false,
    phone: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear store errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case "userName":
        if (!value) return "User Name is required";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      case "fullName":
        if (!value) return "Full name is required";
        if (value.length < 2) return "Full name must be at least 2 characters";
        return "";
      case "phone":
        if (value) {
          const cleanValue = value.replace(/\D/g, '');
          const hasInvalidChars = /[^+\d\s\-()]/.test(value);
          const hasInsufficientDigits = cleanValue.length > 0 && cleanValue.length < 10;
          
          if (hasInvalidChars) return "Phone number contains invalid characters";
          if (hasInsufficientDigits) return "Phone number must be at least 10 digits";
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name] && touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const hasError = (fieldName) => touched[fieldName] && errors[fieldName];

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearError();
    setErrors({});

    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key === "userName" || key === "password") {
        newErrors[key] = validateField(key, formData[key]);
      }
    });
    setErrors(newErrors);

    const isValidForm = !Object.values(newErrors).some(error => error);
    if (!isValidForm) return;

    try {
      // Use Zustand store for login
      const result = await login({
        username: formData.userName,
        password: formData.password,
      });

      if (result.success) {
        // Show success notification
        addNotification({
          type: 'success',
          message: 'Login successful!'
        });
        
        // Navigate to dashboard (will be handled by useEffect)
      } else {
        // Show error notification
        addNotification({
          type: 'error',
          message: result.error || 'Login failed'
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      addNotification({
        type: 'error',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError();
    setErrors({});
    
    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "company") {
        newErrors[key] = validateField(key, formData[key]);
      }
    });
    setErrors(newErrors);
    
    // Check if form is valid
    const isValidForm = !Object.values(newErrors).some(error => error);
    
    if (isValidForm) {
      try {
        // Use Zustand store for signup
        const result = await signup({
          userName: formData.userName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          fullName: formData.fullName,
          company: formData.company
        });

        if (result.success) {
          addNotification({
            type: 'success',
            message: 'Account created successfully! Please log in.'
          });
          
          // Switch to login tab
          setActiveTab('login');
          
          // Clear form data
          setFormData({
            userName: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            email: "",
            phone: "",
            company: ""
          });
        } else {
          addNotification({
            type: 'error',
            message: result.error || 'Signup failed'
          });
        }
      } catch (error) {
        console.error("Signup error:", error);
        addNotification({
          type: 'error',
          message: 'An unexpected error occurred'
        });
      }
    }
  };

  const handleSocialLogin = (provider) => {
    addNotification({
      type: 'info',
      message: `${provider} login coming soon!`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/30 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Building className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-lg mt-2">
            {activeTab === "login" ? "Sign in to your account" : "Create your account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/50 dark:bg-gray-700/50 p-1 rounded-2xl">
              <TabsTrigger 
                value="login" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* API Error Display - Moved to top to avoid layout shifts */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login-username" className="text-gray-700 dark:text-gray-300 font-medium">
                    User Name
                  </Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      hasError('userName') ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="login-username"
                      name="userName"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.userName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`pl-10 pr-4 py-6 bg-white/50 dark:bg-gray-700/50 border-2 transition-all duration-300 rounded-xl ${
                        hasError('userName') 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      required
                    />
                  </div>
                  
                  {/* Field-specific error messages - positioned outside input containers */}
                  {hasError('userName') && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {errors.userName}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      hasError('password') ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`pl-10 pr-12 py-6 bg-white/50 dark:bg-gray-700/50 border-2 transition-all duration-300 rounded-xl ${
                        hasError('password') 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      required
                    />
                    
                    {/* Password Toggle */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 transition-colors duration-300 ${
                        hasError('password') 
                          ? 'text-red-400 hover:text-red-600' 
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Field-specific error messages - positioned outside input containers */}
                  {hasError('password') && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {errors.password}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                  </Label>
                  <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 dark:bg-gray-800/70 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                {[
                  {
                    name: "GitHub",
                    icon: <Github className="h-5 w-5" />,
                    bgColor: "bg-black/20 dark:bg-gray-900/60",
                    textColor: "text-gray-900 dark:text-white",
                    href: "#",
                    onClick: () => handleSocialLogin("github")
                  },
                  {
                    name: "Twitter", 
                    icon: <Twitter className="h-5 w-5" />,
                    bgColor: "bg-blue-500/20 dark:bg-blue-600/40",
                    textColor: "text-blue-600 dark:text-blue-300",
                    href: "#",
                    onClick: () => handleSocialLogin("twitter")
                  },
                  {
                    name: "Facebook",
                    icon: <Facebook className="h-5 w-5" />,
                    bgColor: "bg-blue-700/20 dark:bg-blue-800/40", 
                    textColor: "text-blue-700 dark:text-blue-300",
                    href: "#",
                    onClick: () => handleSocialLogin("facebook")
                  },
                  {
                    name: "Gmail",
                    icon: <Mail className="h-5 w-5" />,
                    bgColor: "bg-red-500/20 dark:bg-red-600/40",
                    textColor: "text-red-600 dark:text-red-300",
                    href: "#",
                    onClick: () => handleSocialLogin("gmail")
                  }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`
                      p-3 rounded-xl backdrop-blur-sm 
                      border border-white/20 dark:border-gray-600/20
                      shadow-lg hover:shadow-xl 
                      transition-all duration-300 ease-in-out
                      transform hover:scale-110
                      ${social.bgColor}
                      ${social.textColor}
                      hover:brightness-110
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      social.onClick();
                    }}
                    aria-label={`Sign in with ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname" className="text-gray-700 dark:text-gray-300 font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      hasError('fullName') ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-fullname"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`pl-10 pr-4 py-6 bg-white/50 dark:bg-gray-700/50 border-2 transition-all duration-300 rounded-xl ${
                        hasError('fullName') 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      required
                    />
                  </div>
                  
                  {/* Field-specific error messages - positioned outside input containers */}
                  {hasError('fullName') && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {errors.fullName}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      hasError('email') ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`pl-10 pr-4 py-6 bg-white/50 dark:bg-gray-700/50 border-2 transition-all duration-300 rounded-xl ${
                        hasError('email') 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      required
                    />
                  </div>
                  
                  {/* Field-specific error messages - positioned outside input containers */}
                  {hasError('email') && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {errors.email}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="text-gray-700 dark:text-gray-300 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      hasError('phone') ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      <Phone className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`pl-10 pr-4 py-6 bg-white/50 dark:bg-gray-700/50 border-2 transition-all duration-300 rounded-xl ${
                        hasError('phone') 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    />
                  </div>
                  
                  {/* Field-specific error messages - positioned outside input containers */}
                  {hasError('phone') && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {errors.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      hasError('password') ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`pl-10 pr-12 py-6 bg-white/50 dark:bg-gray-700/50 border-2 transition-all duration-300 rounded-xl ${
                        hasError('password') 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      required
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 transition-colors duration-300 ${
                        hasError('password') 
                          ? 'text-red-400 hover:text-red-600' 
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Field-specific error messages - positioned outside input containers */}
                  {hasError('password') && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {errors.password}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      hasError('confirmPassword') ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`pl-10 pr-12 py-6 bg-white/50 dark:bg-gray-700/50 border-2 transition-all duration-300 rounded-xl ${
                        hasError('confirmPassword') 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      required
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 transition-colors duration-300 ${
                        hasError('confirmPassword') 
                          ? 'text-red-400 hover:text-red-600' 
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Field-specific error messages - positioned outside input containers */}
                  {hasError('confirmPassword') && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {errors.confirmPassword}
                      </p>
                    </div>
                  )}
                </div>

                <Label className="flex items-start space-x-2 cursor-pointer text-sm">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" 
                    required 
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    I agree to the{" "}
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm">
                      Privacy Policy
                    </Button>
                  </span>
                </Label>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm font-semibold"
                  onClick={() => setActiveTab("login")}
                >
                  Sign in
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
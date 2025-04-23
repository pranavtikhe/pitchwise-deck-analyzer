import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import uploadStyles from '../../styles/upload.module.scss';
import { signIn, signUp } from '@/services/authService';
import { toast } from 'sonner';
import { StarField } from '@/components/StarField';
import landingStyles from '../landing/styles/LandingPage.module.scss';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobile?: string;
}

const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['#ff4444', '#ffbb33', '#ffeb3b', '#00C851', '#007E33'][strength];

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-[#3A3A3A] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${Math.max((strength / 5) * 100, 0)}%`,
              backgroundColor: strengthColor
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{strengthText}</span>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (activeTab === 'signup') {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must meet all requirements';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'signup') {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          throw new Error(error.message);
        }
        toast.success('Account created successfully! Please check your email to verify your account.');
        setActiveTab('login');
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          throw new Error(error.message);
        }
        toast.success('Logged in successfully!');
        navigate('/spider');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const starfieldVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeOut",
        },
    },
};

const ellipseVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.5,
            ease: "easeOut",
        },
    },
};

  return (   
   <>
      <div className={landingStyles.backgroundElements}>
        <motion.div
          className={landingStyles.starfieldWrapper}
          variants={starfieldVariants}
          initial="hidden"
          animate="visible"
        >
          <StarField />
        </motion.div>
        <motion.div
          className={landingStyles.ellipse}
          variants={ellipseVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src="/images/white-radial.svg"
            alt="Radial gradient"
            width={1000}
            height={1000}
          />
        </motion.div>
      </div>
      
      <h1 className="text-center text-5xl font-bold mb-8" style={{ 
        background: 'linear-gradient(to right, #FFFFFF 0%, #959595 50%, #FFFFFF 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 700,
        fontSize: '48px'
      }}>
        PitchWise
      </h1>
      
      <img src="/images/slogo.svg" alt="logo" className="w-[68px] h-[72px] mb-10" />

      <div className="flex justify-center mb-6">
        <motion.div
          className="bg-[#2A2A2A] rounded-full p-1 inline-flex"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-[#2B8CFF] to-[#7B5AFF] text-white'
                : 'text-muted-foreground hover:text-white'
            }`}
            onClick={() => {
              setActiveTab('login');
              setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                mobile: ''
              });
              setErrors({});
            }}
            whileHover={{ scale: activeTab === 'login' ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.button>
          <motion.button
            className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-[#2B8CFF] to-[#7B5AFF] text-white'
                : 'text-muted-foreground hover:text-white'
            }`}
            onClick={() => {
              setActiveTab('signup');
              setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                mobile: ''
              });
              setErrors({});
            }}
            whileHover={{ scale: activeTab === 'signup' ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </motion.div>
      </div>
      <div className={`${uploadStyles.gradientWrapper} w-[676px] min-h-[580px] max-w-[90vw]`}>
        <img
          src="/images/backgroundgradiant.png"
          alt="Gradient Background"
          className={uploadStyles.gradientBackground}
        />
        <div className={`${uploadStyles.innerBox} w-full h-full p-8 flex flex-col`}>
          {error && (
            <motion.div
              className="mb-4 text-destructive text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {activeTab === 'login' ? (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6 w-full max-w-[548px] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white text-left">Username</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full h-16 bg-[#2A2A2A] border ${
                        errors.email ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="text-destructive text-sm">{errors.email}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-white text-left">Password</label>
                    <span className="text-sm text-primary hover:text-primary/80 cursor-pointer">Forgot password?</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full h-16 bg-[#2A2A2A] border ${
                        errors.password ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-destructive text-sm">{errors.password}</span>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className={`${uploadStyles.analyzeButton} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6 w-full max-w-[548px] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white text-left">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full h-16 bg-[#2A2A2A] border ${
                        errors.fullName ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <span className="text-destructive text-sm">{errors.fullName}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white text-left">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full h-16 bg-[#2A2A2A] border ${
                        errors.email ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="text-destructive text-sm">{errors.email}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white text-left">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full h-16 bg-[#2A2A2A] border ${
                        errors.password ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {activeTab === 'signup' && <PasswordStrength password={formData.password} />}
                  {errors.password && (
                    <span className="text-destructive text-sm">{errors.password}</span>
                  )}
                  
                  {activeTab === 'signup' && (
                    <div className="mt-2 text-xs text-muted-foreground text-left">
                      <p className="mb-1 font-medium">Password requirements:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                          At least 8 characters long
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                          Contains at least one uppercase letter
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? "text-green-500" : ""}>
                          Contains at least one lowercase letter
                        </li>
                        <li className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}>
                          Contains at least one number
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : ""}>
                          Contains at least one special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white text-left">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full h-16 bg-[#2A2A2A] border ${
                        errors.confirmPassword ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-destructive text-sm">{errors.confirmPassword}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white text-left">Mobile No.</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full h-16 bg-[#2A2A2A] border ${
                        errors.mobile ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  {errors.mobile && (
                    <span className="text-destructive text-sm">{errors.mobile}</span>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className={`${uploadStyles.analyzeButton} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.form>
            )}
          </motion.div>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#3A3A3A]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1C1C1C] text-muted-foreground">OR</span>
            </div>
          </div>

          <motion.button
            type="button"
            className={uploadStyles.googleButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src="/google-white-icon.svg" alt="Google" className="w-5 h-5" />
            Sign {activeTab === 'login' ? 'in' : 'up'} with Google
          </motion.button>
        </div>
      </div>
      </>
  );
};

export default LoginPage;
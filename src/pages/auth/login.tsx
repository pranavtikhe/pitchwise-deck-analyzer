import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../../styles/upload.module.scss';

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
              width: `${(strength / 5) * 100}%`,
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
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
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
      localStorage.setItem('auth_token', 'demo_token');
      navigate('/spider');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center p-6">
      <img src="/images/slogo.svg" alt="logo" className="w-[68px] h-[72px] mb-10" />

      <div className={`${styles.gradientWrapper} w-[676px] min-h-[580px] max-w-[90vw]`}>
        <img
          src="/images/backgroundgradiant.png"
          alt="Gradient Background"
          className={styles.gradientBackground}
        />
        <div className={`${styles.innerBox} w-full h-full p-8 flex flex-col`}>
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
                className="space-y-4 w-full max-w-[400px] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">User Name</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-[#2A2A2A] border ${
                        errors.email ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="JohnDoe"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="text-destructive text-sm">{errors.email}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full bg-[#2A2A2A] border ${
                        errors.password ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="........."
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
                  className={`${styles.analyzeButton} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                className="space-y-4 w-full max-w-[400px] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full bg-[#2A2A2A] border ${
                        errors.fullName ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <span className="text-destructive text-sm">{errors.fullName}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-[#2A2A2A] border ${
                        errors.email ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="text-destructive text-sm">{errors.email}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full bg-[#2A2A2A] border ${
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
                  <PasswordStrength password={formData.password} />
                  {errors.password && (
                    <span className="text-destructive text-sm">{errors.password}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full bg-[#2A2A2A] border ${
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
                  <label className="block text-sm font-medium text-white">Mobile No.</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full bg-[#2A2A2A] border ${
                        errors.mobile ? 'border-destructive' : 'border-[#3A3A3A]'
                      } rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                      placeholder="9966701238"
                    />
                  </div>
                  {errors.mobile && (
                    <span className="text-destructive text-sm">{errors.mobile}</span>
                  )}
                </div>

                <motion.button 
                  type="submit" 
                  className={`${styles.analyzeButton} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
            className={styles.googleButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src="/google-white-icon.svg" alt="Google" className="w-5 h-5" />
            Sign {activeTab === 'login' ? 'in' : 'up'} with Google
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

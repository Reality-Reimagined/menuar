import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    if (!email || !password) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await signup(email, password, name);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="input-field pl-10"
                  placeholder="Full name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field pl-10"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field pl-10"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (confirmPassword) validatePassword();
                  }}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`input-field pl-10 ${
                    passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (password) validatePassword();
                  }}
                  onBlur={validatePassword}
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !email || !password || !confirmPassword || Boolean(passwordError)}
              className={`btn-primary w-full ${
                isSubmitting || !email || !password || !confirmPassword || Boolean(passwordError)
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or try the demo menu</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/dashboard"
              className="btn-secondary w-full flex justify-center"
            >
              Continue as guest
            </Link>
          </div>
        </div>
        
        <p className="mt-2 text-center text-xs text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;

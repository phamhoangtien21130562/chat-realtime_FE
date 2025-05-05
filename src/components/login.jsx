import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';
 import '../assets/style/login.css'


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });
    // Add authentication logic here
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="card-header">
            <h2>Đăng Nhập</h2>
            <div className="icon-container">
              <Mail className="mail-icon" />
            </div>
          </div>
          
          <div>
            <div className="form-group">
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập email"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                />
                <div className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
              </div>
            </div>
            
            <button 
              type="button" 
              className="login-button"
              onClick={handleSubmit}
            >
              Đăng Nhập
            </button>
            
            <div className="links-container">
              <span 
                className="link" 
                onClick={() => { window.location.href='register.jsx'; }}
              >
                Đăng Ký
              </span>
              
              <span 
                className="link" 
                onClick={() => { window.location.href='forgot_password.html'; }}
              >
                Quên Mật Khẩu
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the sign-up logic here
    console.log('Username:', username, 'Email:', email, 'Password:', password, 'Confirm Password:', confirmPassword);
  };

  return (
    <div className="sign-up-container" style={styles.container}>
      <h1 style={styles.title}>Đăng ký</h1>
      <p>
        Hoặc <Link to="/sign-in" style={{ textDecoration: 'underline', fontWeight: 'bold', color: '#555' }}>đăng nhập vào tài khoản đã có</Link>
      </p>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">Tên người dùng</label>
            <input
              style={styles.input}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              style={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">Mật khẩu</label>
            <input
              style={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              style={styles.input}
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <p style={styles.termsText}>Bằng cách đăng ký, bạn đồng ý với các điều khoản sử dụng của chúng tôi.</p>

          <button type="submit" style={styles.button}>Đăng ký</button>
        </form>
        <div style={styles.orContinueContainer}>
          <div style={styles.line}></div>
          <p style={styles.orContinueText}>Hoặc đăng nhập với</p>
          <div style={styles.line}></div>
        </div>

        <div style={styles.socialButtonsContainer}>
          <button style={styles.socialButton}>
            <img src="/path-to-github-icon" alt="GitHub" style={styles.icon} /> GitHub
          </button>
          <button style={styles.socialButton}>
            <img src="/path-to-google-icon" alt="Google" style={styles.icon} /> Google
          </button>
        </div>

      </div>
    </div>
  );
};

// Basic inline styles for simplicity
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#555',
  },
  signInLink: {
    color: '#555',
    textDecoration: 'underline',
    cursor: 'pointer',
    transition: 'text-decoration 0.2s ease-in-out',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    boxSizing: 'border-box',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontSize: '18px',
    color: '#555',
    textAlign: 'left',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  termsText: {
    textAlign: 'center',
    color: '#555',
    fontSize: '14px',
    marginTop: '20px',
  },
  button: {
    padding: '12px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#0f766e',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0a5c52',
  },
  orContinueContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  },
  line: {
    flex: 1,
    height: '1px',
    backgroundColor: '#ccc',
  },
  orContinueText: {
    margin: '0 10px',
    fontSize: '16px',
    color: '#555',
  },
  socialButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    width: '48%',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
  },
  socialButtonHover: {
    fontWeight: 'bold', // Increase font weight on hover
  },
  icon: {
    marginRight: '8px',
  },
};

export default SignUp;

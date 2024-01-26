import React, {useState, useEffect} from 'react';
import './index.css'
import { Button, Checkbox, Form, Input, message } from 'antd';
import api from '../../api/axios'
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { GithubLoginButton, GoogleLoginButton, FacebookLoginButton } from 'react-social-login-buttons';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const setMessage = (type, content) => {
        messageApi.open({
          type,
          content,
        });
      };
    

    const handleSubmit = async (e) => {
        // e.preventDefault();
    
        try {
            const response = await api.post('/login', {
                email: email,
                password: password,
            }, {
                withCredentials: true,
            });
            
            const { role, accessToken, username } = response.data;
    
            setAuth({ role, jwt: accessToken, username });
            setEmail('');
            setPassword('');
            navigate('/');
        } catch (err) {
            if (!err?.response) {
                setMessage("error",'No Server Response');
            } else if (err.response?.status === 400) {
                setMessage("error",'Missing Email or Password');
            } else if (err.response?.status === 401) {
                setMessage("error", 'Unauthorized');
            } else {
                setMessage("error", 'Login Failed');
            }
            }
    };

    const togglePersist = () => {
        setPersist(true)
    }

    useEffect(() => {
        localStorage.setItem('persist', persist)
    }, [persist])

    const handleGoogleAuth = () => {
        window.open('https://itrabackend-0a797af92f8e.herokuapp.com/auth/google', "_self")
    }
    const handleGithubAuth = () => {
        window.open('https://itrabackend-0a797af92f8e.herokuapp.com/auth/github', "_self")
    }
    const handleFacebookAuth = () => {
        window.open('https://itrabackend-0a797af92f8e.herokuapp.com/auth/facebook', "_self")
    }

    return (
        <section className="login-section">
            {contextHolder}
            <h2>Log In</h2>
            <Form
                name="basic"
                labelCol={{
                span: 8,
                }}
                wrapperCol={{
                span: 16,
                }}
                style={{
                maxWidth: 600,
                }}
                initialValues={{
                remember: true,
                }}
            >
                <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                    required: true,
                    message: 'Please input your Email!',
                    },
                ]}
                >
                <Input value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                    required: true,
                    message: 'Please input your password!',
                    },
                ]}
                >
                <Input.Password value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Item>

                <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                <Checkbox onChange={togglePersist}>Remember me</Checkbox>
                <br />
                <br />
                <span>
                    Need An Account?
                    <Link to={'/register'}><b style={{color: "black"}}> Register</b></Link>
                </span>
                </Form.Item>

                <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                    <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={!email || !password}>
                        Log In
                    </Button>
                    <div className='reg-socials-container' style={{
                        display: "flex",
                        flexDirection: 'column',
                    }}>
                        <GoogleLoginButton onClick={() => handleGoogleAuth()} style={{width: "100%"}}/>
                        <GithubLoginButton onClick={() => handleGithubAuth()} style={{width: "100%"}}/>
                        <FacebookLoginButton onClick={() => handleFacebookAuth()} style={{width: "100%"}} />
                    </div>
                </Form.Item>
            </Form>
        </section>
      );
    };
    
    export default Login;

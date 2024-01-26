import React, {useState} from 'react';
import './index.css'
import { Button, Form, Input, message } from 'antd';
import api from '../../api/axios'
import { Link } from 'react-router-dom';
import { GithubLoginButton, GoogleLoginButton, FacebookLoginButton } from 'react-social-login-buttons';

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [matchPassword, setMatchPassword] = useState('');

    const [messageApi, contextHolder] = message.useMessage();

    const setMessage = (type, content) => {
        messageApi.open({
          type,
          content,
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(password !== matchPassword) {
                setMessage("error", "Passwords Did not match")
            }else {
                await api.post('/register', {
                    email: email,
                    password: password,
                    username: username
                },
                {
                    withCredentials: true,
                });

                setMessage("success", "Registration Successful")
                setUsername('');
                setPassword('');
                setEmail('')
                setMatchPassword('');
            }

        } catch (err) {
            if (!err?.response) {
                setMessage("error",'No Server Response');
            } else if (err.response?.status === 409) {
                setMessage("error", 'Email Taken');
            } else {
                setMessage("error", 'Registration Failed')
            }
        }
    }

    const handleGoogleAuth = () => {
        window.open('https://itrabackend-0a797af92f8e.herokuapp.com/auth/google', "_self")
    }
    const handleGithubAuth = () => {
        window.open('https://itrabackend-0a797af92f8e.herokuapp.com/auth/github', "_self")
    }
    // const handleFacebookAuth = () => {
    //     window.open('http://localhost:3500/auth/facebook', "_self")
    // }
    return (
            <section className="reg-section">
            {contextHolder}
            <h2>Register</h2>
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
                label="Username"
                name="username"
                rules={[
                    {
                    required: true,
                    message: 'Please input your Username!',
                    },
                ]}
                >
                <Input value={username} onChange={e => setUsername(e.target.value)} />
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
                label="re-Password"
                name="re-password"
                rules={[
                    {
                    required: true,
                    message: 'Please confirm your password!',
                    },
                ]}
                >
                <Input.Password value={matchPassword} onChange={e => setMatchPassword(e.target.value)} />
                </Form.Item>

                <Form.Item
                name="link"
                style={{
                    display: "flex",
                    flexDirection: "column"
                }}
                >
                    <span>
                        Allready have An Account?
                        <Link to={'/login'}><b style={{color: "black"}}> Log In</b></Link>
                    </span>
                </Form.Item>

                <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                    <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={!email || !password || !username || !matchPassword}>
                        Register
                    </Button>
                <div className='reg-socials-container' style={{
                    display: "flex",
                    flexDirection: 'column',
                }}>
                    <GoogleLoginButton onClick={() => handleGoogleAuth()} style={{width: "100%"}}/>
                    <GithubLoginButton onClick={() => handleGithubAuth()} style={{width: "100%"}}/>
                    <FacebookLoginButton onClick={() => handleGithubAuth()} style={{width: "100%"}} />
                </div>
                </Form.Item> 
            </Form>
            </section>
        )}

export default Register
import React, { useState } from 'react'
import axios from 'axios'
import logo from '../../images/Logo.png'
import { useNavigate } from 'react-router-dom'
import { userAuthenticated } from '../utils/UserAuthenticated'

const Login = ({ setUserAuthenticatedState, path }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)
    const [validEmail, setValidEmail] = useState(true)
    const [errorExists, setErrorExists] = useState(false)
    const navigate = useNavigate()

    const storeToken = (token) => {
        window.localStorage.setItem('groupie-token', token)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let url = '/api/auth/'
            validEmail ? (url += 'login/') : (url += 'register/')
            console.log(formData)
            const { data } = await axios.post(url, formData)
            storeToken(await data.token)
            setUserAuthenticatedState(userAuthenticated())
            navigate({ path })
        } catch (error) {
            setErrorExists(true)
            setLoading(false)
            const { message } = error.response.data
            console.log(message)
        }
    }

    const verifyEmail = async () => {
        try {
            const { data } = await axios.post(
                '/api/auth/verify_email/',
                formData
            )
            setValidEmail(data.emailExists)
            console.log(data.emailExists)
            window.scrollBy(0, 50)
        } catch (error) {
            const { message } = error.response.data
            console.log(message)
        }
    }

    return (
        <>
            <img src={logo} alt={'Groupie - lets go together'}></img>
            <form className='parent-flexbox' onSubmit={handleSubmit}>
                {!loading ? (
                    <>
                        {errorExists && (
                            <p>
                                <span className='alert'>
                                    I'm afraid we couldn't{' '}
                                    {validEmail ? 'log you in' : 'regester you'}{' '}
                                </span>
                                <br />
                                <br /> Please try again
                            </p>
                        )}
                        <input
                            onChange={handleChange}
                            onBlur={verifyEmail}
                            name={'email'}
                            type={'email'}
                            placeholder={'Email'}
                            className='login-text-input'
                        ></input>
                        <input
                            onChange={handleChange}
                            name={'password'}
                            placeholder={'Password'}
                            type={'password'}
                            className='login-text-input'
                        ></input>
                        {!validEmail ? (
                            <>
                                <p>
                                    You look new!
                                    <br />
                                    <br />
                                    Complete the form below to get started
                                </p>
                                <input
                                    onChange={handleChange}
                                    name={'password_confirmation'}
                                    placeholder={'Password (again)'}
                                    type={'password'}
                                    className='login-text-input'
                                ></input>
                                <input
                                    onChange={handleChange}
                                    name={'first_name'}
                                    placeholder={'First name'}
                                    type={'text'}
                                    className='login-text-input'
                                ></input>
                                <input
                                    onChange={handleChange}
                                    name={'last_name'}
                                    placeholder={'Last name'}
                                    type={'text'}
                                    className='login-text-input'
                                ></input>
                                <button className='login-button' type='submit'>
                                    Register
                                </button>{' '}
                                <br />
                                <br />
                                <br />
                            </>
                        ) : (
                            <>
                                <button className='login-button' type='submit'>
                                    Login
                                </button>
                                <br />
                                <br />
                                <br />
                            </>
                        )}
                    </>
                ) : (
                    <div className='loader'>Loading...</div>
                )}
            </form>
        </>
    )
}

export default Login

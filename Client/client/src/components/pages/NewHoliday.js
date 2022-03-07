import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from '../elements/Header'

const NewHoliday = () => {
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        destination: '',
        budget: '',
        budgetCurrency: ''
    })

    const [loading, setLoading] = useState(false)
    const [createStage, setCreateStage] = useState(0)
    const [renderStage, setRenderStage] = useState('')
    const [errorExists, setErrorExists] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let url = '/api/auth/'
            console.log(formData)
            const { data } = await axios.post(url, formData)
            navigate(data.id)
        } catch (error) {
            setErrorExists(true)
            setLoading(false)
            const { message } = error.response.data
            console.log(message)
        }
    }

    const updateStage = (e) => {
        setCreateStage(Number(e.target.value))
    }

    const renderSwitch = () => {
        switch (createStage) {
            case 0:
                return (
                    <>
                        <form>
                            <label htmlFor='title'>
                                What do you want to call this trip?
                            </label>
                            <input
                                onChange={handleChange}
                                name={'title'}
                                type={'text'}
                                placeholder={"e.g. David's stag"}
                                className='login-text-input'
                            ></input>
                        </form>
                        <button onClick={updateStage} value={1} type='submit'>
                            Continue
                        </button>
                    </>
                )
            case 1:
                return (
                    <>
                        <p>Have you agreed on a budget for this trip?</p>
                        <button value={2} onClick={updateStage}>
                            Yes
                        </button>
                        <button value={3} onClick={updateStage}>
                            Not yet
                        </button>
                    </>
                )

            case 2:
                return (
                    <>
                        <p>What is your budget?</p>
                        <form>
                            <select name='budgetCurrency'>
                                <option value='£'>£</option>
                                <option value='$'>$</option>
                                <option value='€'>€</option>
                            </select>
                            <input
                                onChange={handleChange}
                                name={'budget'}
                                placeholder={'e.g. 500'}
                                type={'number'}
                                className='login-text-input'
                            ></input>
                        </form>
                        <button value={3} onClick={updateStage}>
                            Confirm Budget
                        </button>
                    </>
                )
            case 3:
                return (
                    <>
                        <p>Have you agreed on the dates for this trip?</p>
                        <button value={5} onClick={updateStage}>
                            Yes
                        </button>
                        <button value={4} onClick={updateStage}>
                            Not yet
                        </button>
                    </>
                )

            case 4:
                return (
                    <>
                        <p>Propose some possible dates below</p>
                    </>
                )
            default:
                return 'foo'
        }
    }

    return (
        <>
            <Header />
            <main>
                {!loading ? (
                    <>
                        {errorExists && (
                            <p>
                                <span className='alert'>
                                    I'm afraid there was an error
                                </span>
                                <br />
                                <br /> Please try again
                            </p>
                        )}

                        {renderSwitch()}
                    </>
                ) : (
                    <div className='loader'>Loading...</div>
                )}
            </main>
        </>
    )
}

export default NewHoliday

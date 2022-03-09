import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from '../elements/Header'
import { getTokenFromLocalStorage } from '../utils/UserAuthenticated'
import { convertDate } from '../utils/Tools'

const NewHoliday = () => {
	const [formData, setFormData] = useState({
		title: '',
		budget_currency: '£'
	})

	const [dateData, setDateData] = useState({})
	const [holidayData, setHolidayData] = useState({})
	const [loading, setLoading] = useState(false)
	const [createStage, setCreateStage] = useState(0)
	const [errorExists, setErrorExists] = useState(false)
	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleChangeDate = (e) => {
		setDateData({ ...dateData, [e.target.name]: e.target.value })
	}

	const createHoliday = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}

			const { data } = await axios.post(
				'/api/holiday/',
				formData,
				headers
			)

			setHolidayData({ ...holidayData, ...data })
			setFormData({ ...formData, holiday_id: data.id })
			setDateData({ ...dateData, holiday_id: data.id })
			setLoading(false)
			setCreateStage(Number(e.target.value))
			setErrorExists(false)
		} catch (error) {
			setErrorExists(true)
			setLoading(false)
			const { message } = error.response.data
			console.log(message)
		}
	}

	const updateHoliday = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}
			const { data } = await axios.put('/api/holiday/', formData, headers)
			setHolidayData({ ...holidayData, ...data })
			setLoading(false)
			setCreateStage(Number(e.target.value))
			setErrorExists(false)
		} catch (error) {
			setErrorExists(true)
			setLoading(false)
			const { message } = error.response.data
			console.log(message)
		}
	}

	const getHoliday = async () => {
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}
			const { data } = await axios.get(
				`/api/holiday/${formData.holiday_id}/`,
				headers
			)
			setHolidayData({ ...holidayData, ...data })
			setErrorExists(false)
		} catch (error) {
			setErrorExists(true)
			const { message } = error.response.data
			console.log(message)
		}
	}

	useEffect(() => {
		console.log('Holiday Data', holidayData)
	}, [holidayData])

	const addDate = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}

			const { data } = await axios.post(
				'/api/dates/proposed/',
				dateData,
				headers
			)
			console.log(data)
			getHoliday()
			setLoading(false)
			setErrorExists(false)
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
						<button onClick={createHoliday} value={1} type='submit'>
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
							<select
								name='budgetCurrency'
								onChange={handleChange}
							>
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
						<button value={3} onClick={updateHoliday}>
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
						<p>Add a date</p>
						<form>
							<input
								onChange={handleChangeDate}
								name={'start_date'}
								type={'date'}
								className='login-text-input'
							></input>
							<input
								onChange={handleChangeDate}
								name={'end_date'}
								type={'date'}
								className='login-text-input'
							></input>
						</form>
						<button onClick={addDate} type='submit'>
							Add
						</button>

						{!holidayData.dates_proposed ? (
							'You need to propose at least one set of dates'
						) : (
							<>
								<button
									value={6}
									onClick={updateStage}
									type='submit'
								>
									Continue
								</button>

								{holidayData.dates_proposed.map(
									(date_proposed) => {
										return (
											<p key={date_proposed.id}>
												{`${convertDate(
													date_proposed.start_date
												)} - ${convertDate(
													date_proposed.end_date
												)}`}
											</p>
										)
									}
								)}
							</>
						)}
					</>
				)
			case 5:
				return (
					<>
						<form>
							<input
								onChange={handleChange}
								name={'start_date'}
								type={'date'}
								className='login-text-input'
							></input>
							<input
								onChange={handleChange}
								name={'end_date'}
								type={'date'}
								className='login-text-input'
							></input>
						</form>
						<button onClick={updateHoliday} value={6} type='submit'>
							Continue
						</button>
					</>
				)
			case 6:
				return (
					<>
						<p>Do you know where you want to go yet?</p>
						<button value={7} onClick={updateStage}>
							Yes
						</button>
						<button value={8} onClick={updateStage}>
							Not yet
						</button>
					</>
				)
			case 7:
				return (
					<>
						<form>
							<input
								onChange={handleChange}
								name={'destination'}
								type={'text'}
								className='login-text-input'
							></input>
						</form>
						<button onClick={updateHoliday} value={9} type='submit'>
							Confirm
						</button>
					</>
				)

			default:
				navigate('/')
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

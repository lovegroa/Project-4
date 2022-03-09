import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../elements/Header'
import { getTokenFromLocalStorage } from '../utils/UserAuthenticated'
import { convertDate } from '../utils/Tools'

const Holiday = () => {
	const [formData, setFormData] = useState({})
	const [userHolidayData, setUserHolidayData] = useState({ updated: false })
	const { userHolidayID } = useParams()
	const [loading, setLoading] = useState(false)
	const [createStage, setCreateStage] = useState(0)
	const [errorExists, setErrorExists] = useState(false)
	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	useEffect(() => {
		const getUserHoliday = async () => {
			setLoading(true)
			try {
				const headers = {
					headers: {
						Authorization: `Bearer ${getTokenFromLocalStorage()}`
					}
				}
				const { data } = await axios.get(
					`/api/user_holiday/${userHolidayID}/`,
					headers
				)
				setUserHolidayData({ ...data, updated: true })
				setErrorExists(false)
				setLoading(false)
			} catch (error) {
				setErrorExists(true)
				const { message } = error.response.data
				console.log(message)
				setLoading(false)
			}
		}
		getUserHoliday()
	}, [userHolidayID])

	useEffect(() => {
		const identifyStage = () => {
			console.log(userHolidayData)
			if (userHolidayData.updated) {
				const { holiday_id } = userHolidayData

				if (!holiday_id.budget && userHolidayData.budget === -1)
					return 0 //if no budget has been set the user needs to provide their budget
				if (!holiday_id.start_date) {
					if (!userHolidayData.dates_voted_confirmed) return 1 // user needs to select what dates work for them out of the list
					if (userHolidayData.is_admin) return 2 //admin needs to confirm these dates
					return 1
				}
				if (!userHolidayData.dates_confirmed) return 3 // user needs to confirm that they definitely can make these dates, e.g. have booked time off and also that they are happy with the budget
				return 4
			}
		}
		setCreateStage(identifyStage())
	}, [userHolidayData])

	const updateUserHoliday = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}
			const { data } = await axios.put(
				`/api/user_holiday/${userHolidayID}/`,
				formData,
				headers
			)
			setUserHolidayData({ ...userHolidayData, ...data })
			setLoading(false)
			setErrorExists(false)
		} catch (error) {
			setErrorExists(true)
			setLoading(false)
			const { message } = error.response.data
			console.log(message)
		}
	}

	// const updateStage = (e) => {
	// 	setCreateStage(Number(e.target.value))
	// }

	const renderSwitch = () => {
		switch (createStage) {
			case 0:
				return (
					<>
						<p>What is your budget for this trip?</p>
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
						<button value={1} onClick={updateUserHoliday}>
							Confirm Budget
						</button>
					</>
				)
			case 1:
				return (
					<>
						<p>
							Out of the dates below please confirm which work for
							you
						</p>
						{userHolidayData.holiday_id.dates_proposed.map(
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
				)

			default:
				return (
					<>
						<p>stage not yet created</p>
					</>
				)
		}
	}

	return (
		<>
			<Header />
			<main>
				<h1>{userHolidayData.id}</h1>
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

export default Holiday

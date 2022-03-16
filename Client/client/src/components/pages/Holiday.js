import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../elements/Header'
import { getTokenFromLocalStorage } from '../utils/UserAuthenticated'
import { convertDate } from '../utils/Tools'
import DestinationsProposed from '../elements/DestinationsProposed'

const Holiday = () => {
	const [formData, setFormData] = useState({})
	const [userHolidayData, setUserHolidayData] = useState({ updated: false })
	const [holidayData, setHolidayData] = useState({})
	const { userHolidayID } = useParams()
	const [loading, setLoading] = useState(false)
	const [createStage, setCreateStage] = useState(0)
	const [errorExists, setErrorExists] = useState(false)
	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleHolidayChange = (e) => {
		setHolidayData({ ...holidayData, [e.target.name]: e.target.value })
	}

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
			// setHolidayData({
			// 	holiday_id: userHolidayData.holiday_id.id
			// })
			setErrorExists(false)
			setLoading(false)
		} catch (error) {
			setErrorExists(true)
			const { message } = error.response.data
			console.log(message)
			setLoading(false)
		}
	}

	useEffect(() => {
		if (userHolidayData.updated) {
			setHolidayData({
				holiday_id: userHolidayData.holiday_id.id
			})
		}
	}, [userHolidayData])

	useEffect(() => {
		getUserHoliday()
	}, [userHolidayID])

	useEffect(() => {
		const identifyStage = () => {
			// console.log(userHolidayData)
			if (userHolidayData.updated) {
				const { holiday_id } = userHolidayData

				if (!holiday_id.budget && !userHolidayData.budget) return 0 //if no budget has been set the user needs to provide their budget
				if (!holiday_id.start_date) {
					return 1
				}
				if (!holiday_id.budget) {
					if (userHolidayData.is_admin) {
						return 2
					}
					return 100
				}

				if (!userHolidayData.dates_confirmed) return 3 // user needs to confirm that they definitely can make these dates, e.g. have booked time off and also that they are happy with the budget

				let allUsersHaveConfirmed = true

				userHolidayData.holiday_id.user_holidays.forEach(
					(user_holiday) => {
						if (!user_holiday.dates_confirmed)
							allUsersHaveConfirmed = false
					}
				)

				if (!allUsersHaveConfirmed) {
					//only allows users to pass once everyone has booked time off
					if (userHolidayData.is_admin) {
						//admin can see a table of who has / has not confirmed
						return 4
					}
					return 100
				}

				if (!userHolidayData.holiday_id.destination) {
					return 5
				}

				return 5
			}
		}
		setCreateStage(identifyStage())
	}, [userHolidayData])

	const updateUserHoliday = async (e) => {
		e.preventDefault()
		setLoading(true)
		console.log('formData', formData)
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

	const updateHoliday = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}
			await axios.put('/api/holiday/', holidayData, headers)
			getUserHoliday()
			setLoading(false)
			setErrorExists(false)
		} catch (error) {
			setErrorExists(true)
			setLoading(false)
			const { message } = error.response.data
			console.log(message)
		}
	}

	const voteOnDate = async (voteData) => {
		setLoading(true)
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}
			await axios.post(`/api/dates/voted/`, voteData, headers)

			getUserHoliday()
			setLoading(false)
			setErrorExists(false)
		} catch (error) {
			setErrorExists(true)
			setLoading(false)
			const { message } = error.response.data
			console.log(message)
		}
	}

	const updateVoteOnDate = async (voteData) => {
		setLoading(true)
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${getTokenFromLocalStorage()}`
				}
			}
			await axios.put(`/api/dates/voted/`, voteData, headers)

			getUserHoliday()
			setLoading(false)
			setErrorExists(false)
		} catch (error) {
			setErrorExists(true)
			setLoading(false)
			const { message } = error.response.data
			console.log(message)
		}
	}

	const upVoteDateNew = (e) => {
		e.preventDefault()
		voteOnDate({
			date_proposed_id: e.target.value,
			date_confirmed: true
		})

		console.log(e.target.value)
	}

	const upVoteDateUpdate = (e) => {
		e.preventDefault()
		updateVoteOnDate({
			date_voted_id: e.target.value,
			date_confirmed: true
		})
		console.log(e.target.value)
	}

	const downVoteDateNew = (e) => {
		e.preventDefault()
		voteOnDate({
			date_proposed_id: e.target.value,
			date_confirmed: false
		})
		console.log(e.target.value)
	}

	const downVoteDateUpdate = (e) => {
		e.preventDefault()
		updateVoteOnDate({
			date_voted_id: e.target.value,
			date_confirmed: false
		})
		console.log(e.target.value)
	}

	const confirmDatesAndBudget = (e) => {
		handleChange(e)
		console.log('test')
		// setFormData({ ...formData, dates_confirmed: true })
		updateUserHoliday(e)
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
						<table>
							<thead>
								<tr>
									<th>Start Date</th>
									<th>End Date</th>
									<th>👍</th>
									<th>👎</th>
								</tr>
							</thead>
							<tbody>
								{userHolidayData.holiday_id.dates_proposed.map(
									(date_proposed) => {
										let upVoteCount = 0
										let downVoteCount = 0
										let myVote = 0
										let myVoteId

										date_proposed.dates_voted.map(
											(vote) => {
												if (
													vote.user_id.id ===
														userHolidayData.user_id &&
													vote.date_confirmed
												) {
													myVote += 1
													myVoteId = vote.id
												}
												if (
													vote.user_id.id ===
														userHolidayData.user_id &&
													!vote.date_confirmed
												) {
													myVote -= 1
													myVoteId = vote.id
												}

												vote.date_confirmed
													? (upVoteCount += 1)
													: (downVoteCount += 1)

												return ''
											}
										)

										return (
											<tr key={date_proposed.id}>
												<td>
													{convertDate(
														date_proposed.start_date
													)}
												</td>
												<td>
													{convertDate(
														date_proposed.end_date
													)}
												</td>
												<td>{upVoteCount}</td>
												<td>{downVoteCount}</td>

												{!myVote ? (
													<>
														<td>
															<button
																onClick={
																	upVoteDateNew
																}
																value={
																	date_proposed.id
																}
																className='none'
															>
																👍
															</button>
														</td>
														<td>
															<button
																onClick={
																	downVoteDateNew
																}
																value={
																	date_proposed.id
																}
																className='none'
															>
																👎
															</button>
														</td>
													</>
												) : (
													<>
														<td>
															<button
																onClick={
																	upVoteDateUpdate
																}
																value={
																	myVoteId

																	// date_proposed.id
																}
																style={
																	myVote === 1
																		? {
																				background:
																					'green'
																		  }
																		: {}
																}
																className='none'
															>
																👍
															</button>
														</td>
														<td>
															<button
																onClick={
																	downVoteDateUpdate
																}
																value={
																	myVoteId

																	// date_proposed.id
																}
																style={
																	myVote ===
																	-1
																		? {
																				// border: 'solid 1px black',
																				background:
																					'red'
																		  }
																		: {}
																}
																className='none'
															>
																👎
															</button>
														</td>
													</>
												)}
											</tr>
										)
									}
								)}
							</tbody>
						</table>

						{userHolidayData.is_admin ? (
							<>
								<h3>Confirm dates</h3>
								<form>
									<input
										onChange={handleHolidayChange}
										name={'start_date'}
										type={'date'}
										className='login-text-input'
									></input>
									<input
										onChange={handleHolidayChange}
										name={'end_date'}
										type={'date'}
										className='login-text-input'
									></input>
								</form>
								<button onClick={updateHoliday} type='submit'>
									Confirm
								</button>
							</>
						) : (
							''
						)}
					</>
				)
			case 2:
				return (
					<>
						{userHolidayData.updated ? (
							<>
								<table>
									<thead>
										<tr>
											<th> Group Member</th>
											<th> Budget</th>
										</tr>
									</thead>
									<tbody>
										{userHolidayData.holiday_id.user_holidays.map(
											(user_holiday) => {
												return (
													<>
														<tr
															key={
																user_holiday.id
															}
														>
															<td>
																{
																	user_holiday
																		.user_id
																		.first_name
																}{' '}
																{
																	user_holiday
																		.user_id
																		.last_name
																}
															</td>
															<td>
																{
																	userHolidayData
																		.holiday_id
																		.budget_currency
																}
																{
																	user_holiday.budget
																}
															</td>
														</tr>
													</>
												)
											}
										)}
									</tbody>
								</table>
							</>
						) : (
							''
						)}

						<p>Confirm budget</p>
						<form>
							<select
								name='budget_currency'
								onChange={handleHolidayChange}
							>
								<option value='£'>£</option>
								<option value='$'>$</option>
								<option value='€'>€</option>
							</select>
							<input
								onChange={handleHolidayChange}
								name={'budget'}
								placeholder={'e.g. 500'}
								type={'number'}
								className='login-text-input'
							></input>
						</form>
						<button onClick={updateHoliday}>Confirm</button>
					</>
				)

			case 3:
				return (
					<>
						<h2>All steam ahead!</h2>
						<p>
							these are the final dates and budget for your trip
							<br />
							now is the time to book time off!
						</p>
						<h4>Confirmed Dates</h4>
						{userHolidayData.updated ? (
							<>
								{convertDate(
									userHolidayData.holiday_id.start_date
								)}{' '}
								{' - '}{' '}
								{convertDate(
									userHolidayData.holiday_id.end_date
								)}
							</>
						) : (
							''
						)}{' '}
						<h4>Confirmed Budget</h4>
						<p>
							{userHolidayData.holiday_id.budget_currency}
							{userHolidayData.holiday_id.budget}
						</p>
						<h3>
							I'm 100% happy with these dates and this budget!
						</h3>
						<button
							name={'dates_confirmed'}
							value={true}
							onClick={confirmDatesAndBudget}
						>
							Confirm
						</button>
					</>
				)

			case 4:
				return (
					<>
						{userHolidayData ? (
							<>
								<table>
									<thead>
										<tr>
											<th> Group Member</th>
											<th> Confirmed</th>
										</tr>
									</thead>
									<tbody>
										{userHolidayData.holiday_id.user_holidays.map(
											(user_holiday) => {
												return (
													<>
														<tr
															key={
																user_holiday.id
															}
														>
															<td>
																{
																	user_holiday
																		.user_id
																		.first_name
																}{' '}
																{
																	user_holiday
																		.user_id
																		.last_name
																}
															</td>
															<td>
																{user_holiday.dates_confirmed
																	? 'True'
																	: 'Not yet'}
															</td>
														</tr>
													</>
												)
											}
										)}
									</tbody>
								</table>
							</>
						) : (
							''
						)}
					</>
				)

			case 5:
				return (
					<>
						<DestinationsProposed
							userHolidayData={userHolidayData}
						/>
					</>
				)
			default:
				return (
					<>
						<p>Waiting on admin</p>
					</>
				)
		}
	}

	return (
		<>
			<Header />
			<main>
				<h1>
					{userHolidayData.updated
						? userHolidayData.holiday_id.title
						: ''}
				</h1>

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

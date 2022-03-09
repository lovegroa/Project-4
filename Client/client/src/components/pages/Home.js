import React, { useEffect, useState } from 'react'
import Footer from '../elements/Footer'
import Header from '../elements/Header'
import { useNavigate } from 'react-router-dom'
import { getTokenFromLocalStorage } from '../utils/UserAuthenticated'
import axios from 'axios'
import HolidayCard from '../elements/HolidayCard'

const Home = () => {
	const navigate = useNavigate()
	const [profileData, setProfileData] = useState({})

	// use Effect to retrieve profile information on page load
	useEffect(() => {
		const getProfile = async () => {
			try {
				const headers = {
					headers: {
						Authorization: `Bearer ${getTokenFromLocalStorage()}`
					}
				}
				const { data } = await axios.get(`/api/auth/profile/`, headers)
				setProfileData({ ...data })
			} catch (error) {
				console.log(error.message)
			}
		}
		getProfile()
	}, [])

	const NewHoliday = () => {
		navigate('/holiday/new')
	}
	return (
		<>
			<Header />
			<main>
				<br />

				<button>Join a holiday</button>
				<button onClick={NewHoliday}>New holiday</button>
				<h2>Holidays</h2>
				{!!profileData.user_holidays &&
					profileData.user_holidays.map((holiday) => {
						return (
							<HolidayCard key={holiday.id} holiday={holiday} />
						)
					})}

				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
			</main>
			<div id='main-fade'></div>
			<Footer />
		</>
	)
}

export default Home

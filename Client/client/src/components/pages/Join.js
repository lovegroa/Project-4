import { useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStorage } from '../utils/UserAuthenticated'
import axios from 'axios'

const Join = () => {
	const [loading, setLoading] = useState(false)
	const [errorExists, setErrorExists] = useState(false)
	const { joinCode } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		const joinHoliday = async () => {
			setLoading(true)
			try {
				const headers = {
					headers: {
						Authorization: `Bearer ${getTokenFromLocalStorage()}`
					}
				}
				const { data } = await axios.post(
					`/api/user_holiday/join/`,
					{ join_code: joinCode },
					headers
				)
				setErrorExists(false)
				setLoading(false)
				navigate(`/user_holiday/${data.id}`)
			} catch (error) {
				setErrorExists(true)
				const { message } = error.response.data
				console.log(message)
				setLoading(false)
			}
		}
		joinHoliday()
	}, [navigate, joinCode])

	return (
		<>
			{' '}
			{!loading ? (
				<>
					{errorExists && (
						<p>
							<span className='alert'>
								Unable to join holiday
							</span>
						</p>
					)}
				</>
			) : (
				<div className='loader'>Joining Holiday</div>
			)}
		</>
	)
}

export default Join

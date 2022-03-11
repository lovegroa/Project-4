import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
	const navigate = useNavigate()

	const handleLogOut = () => {
		localStorage.removeItem('groupie-token')
		navigate(0)
	}

	return (
		<footer>
			<button>Profile</button>{' '}
			<button onClick={handleLogOut}>Sign out</button>
		</footer>
	)
}

export default Footer

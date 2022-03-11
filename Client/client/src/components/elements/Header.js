import React from 'react'
import logo2 from '../../images/logo2.png'
import { useNavigate } from 'react-router-dom'

const Header = () => {
	const navigate = useNavigate()

	const goToHomepage = () => {
		navigate('/')
	}

	return (
		<header>
			<img
				onClick={goToHomepage}
				src={logo2}
				alt={'Groupie - lets go together'}
			></img>
		</header>
	)
}

export default Header

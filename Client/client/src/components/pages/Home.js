import React from 'react'
import Footer from '../elements/Footer'
import Header from '../elements/Header'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const NewHoliday = () => {
        navigate('/holiday/new')
    }

    return (
        <>
            <Header />
            <main>
                <br />

                <button onClick={NewHoliday}>Join a holiday</button>
                <button>New holiday</button>
                <h2>Upcoming Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
                <h2>Past Holidays</h2>
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

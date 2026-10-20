import React from 'react'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'

const Settings = () => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <h1>Settings</h1>
      </div>
    </div>
  )
}

export default Settings

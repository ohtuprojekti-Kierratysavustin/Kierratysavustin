import React, { useState } from 'react'
// importtaa registerservice
const RegisterForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    const user = { username, password }
    // Kutsu registerpalvelua ja anna parametrit
    console.log('Tama on käyttäjä',user)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input id="usernameInput" type="text" name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          Password:
          <input id="passwordInput" type="password" name ="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button id="registerButton" type='submit'>rekisteröidy</button>

      </form>
    </div>
  )
}
export default RegisterForm

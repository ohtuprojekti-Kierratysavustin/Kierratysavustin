# Asioita, jotka on hyvä tietää:

Komponentit tilan muuttaminen hyvä tehdä synkronisesti. Esimerkkinä 

```
await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'Myname' } })
        fireEvent.change(passwordInput, { target: { value: 'myPassword' } })
        fireEvent.click(submitButton)
      })
```

Ei toimi

```
await act(async () => {
  fireEvent.change(usernameInput, { target: { value: 'Myname' } })
})
await act(async () => {
  fireEvent.change(passwordInput, { target: { value: 'myPassword' } })
})
await act(async () => {
  fireEvent.click(submitButton)
})
```

Toimii


## Riippuvuuksista

Service, jota komponentti kutsuu mockattu. Esimerkkejä ProductUserCountForm.test.tsx ja RegisterForm.test.tsx
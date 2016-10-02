import React from 'react'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-addons-test-utils'

import Login from './../../src/components/Login'
import storage from './../../src/lib/storage'

import mockLocalStorage from './../mockLocalStorage'
mockLocalStorage()

import { mockRequest } from 'superagent'
mockRequest(`${process.env.REACT_APP_API_HOST}/request_token`, {token: 'RT123456', secret: 'RT654321'})
mockRequest(`${process.env.REACT_APP_API_HOST}/access_token`, {token: 'AT123456', secret: 'AT654321'})

it('disables the authorize button when loading the request token', () => {
  const div = document.createElement('div')
  const login = ReactDOM.render(<Login onAccessTokenLoaded={() => {}} />, div)
  const authorizeButton = login.refs.authorizeButton
  login.setState({loadingRequestToken: true})

  expect(authorizeButton.disabled).toBe(true)
  expect(authorizeButton.textContent).toBe('Loading...')
})

it('stores the request token', () => {
  const div = document.createElement('div')
  const login = ReactDOM.render(<Login onAccessTokenLoaded={() => {}} />, div)
  const authorizeButton = login.refs.authorizeButton

  ReactTestUtils.Simulate.click(authorizeButton)

  expect(storage.getItem('requestToken')).toEqual({token: 'RT123456', secret: 'RT654321'})
})

it('updates the state when the pin code input is changed', () => {
  const div = document.createElement('div')
  const login = ReactDOM.render(<Login onAccessTokenLoaded={() => {}} />, div)
  const pinCodeInput = login.refs.pinCodeInput

  ReactTestUtils.Simulate.change(pinCodeInput, {target: {value: 'PIN123456'}})

  expect(login.state.pincode).toBe('PIN123456')
})

it('loads the access token and pass it along to the onAccessTokenLoaded prop callback', () => {
  const div = document.createElement('div')
  const onAccessTokenLoaded = jest.fn()
  const login = ReactDOM.render(<Login onAccessTokenLoaded={onAccessTokenLoaded} />, div)
  const authorizeButton = login.refs.authorizeButton
  const pinCodeInput = login.refs.pinCodeInput
  const submitPinCodeButton = login.refs.submitPinCodeButton

  ReactTestUtils.Simulate.click(authorizeButton)
  ReactTestUtils.Simulate.change(pinCodeInput, {target: {value: 'PIN123456'}})
  ReactTestUtils.Simulate.click(submitPinCodeButton)

  expect(onAccessTokenLoaded.mock.calls.length).toBe(1)
  expect(onAccessTokenLoaded.mock.calls[0][0]).toEqual({token: 'AT123456', secret: 'AT654321'})
})

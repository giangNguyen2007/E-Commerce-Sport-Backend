const request = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Product = require('../models/Product')
const testData = require('../__testMockData__/userMockData')
const User = require('../models/User')
const jwt = require("jsonwebtoken");


describe('[1] test /auth/register route', () => { 

    beforeEach(() => {
        jest.clearAllMocks()
      })

    test('invalid user data >> should receive "invalid data" error', async() => { 

        const response = await request(app).post("/api/auth/register").send({
            username: "giang-nguyen3",
            email: "rairacergmail.com",
            password: "1237845"
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual(expect.objectContaining( {errors: expect.anything()} ))

    })

    test('valid user data >> should receive successful response with accessToken', async() => { 

      const requestBody = {
        username: "giang-nguyen3",
        email: "rairacer@gmail.com",
        password: "1237845"
      }

      User.create = jest.fn((object) => Promise.resolve({_doc : object}))
      jwt.sign = jest.fn(() => 'mockAccessToken')

      const response = await request(app).post("/api/auth/register").send(requestBody)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(expect.objectContaining( {
        username: "giang-nguyen3",
        email: "rairacer@gmail.com",
        accessToken: "mockAccessToken"
      }))

    })

    test('valid user data, but username already exists in database >> should receive error', async() => { 

      const requestBody = {
        username: "giang-nguyen3",
        email: "rairacer@gmail.com",
        password: "1237845"
      }

      User.create = jest.fn((object) => Promise.reject(new Error("user already exists")))

      const response = await request(app).post("/api/auth/register").send(requestBody)

      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual(expect.objectContaining({ error: "user already exists"}))


    })

 })


describe('[2] test /auth/login route', () => { 

  beforeEach(() => {
      jest.clearAllMocks()
    })

  test('invalid user data >> should receive "invalid data" error', async() => { 

      const response = await request(app).post("/api/auth/login").send({
          username: "giang-nguyen3",
          email: "gianggmail.com",
          password: "1237845"
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual(expect.objectContaining( {errors: expect.anything()} ))

  })

  test('valid user data, but wrong password >> should receive "wrong password" error message', async() => { 

    const requestBody = {
      username: "giang-nguyen3",
      email: "rairacer@gmail.com",
      password: "37845"
    }

    const mockFindOne = async ({username}) => {
       const user = testData.userData.filter( user => user.username === username)[0];
       return Promise.resolve(user)
    }

    User.findOne = jest.fn(mockFindOne)

    const response = await request(app).post("/api/auth/login").send(requestBody)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(expect.objectContaining( {error: 'Password not matching'} ))

  })

  test('valid user data, and valid password >> should receive success response with accessToken', async() => { 

    const requestBody = {
      username: "giang-nguyen3",
      email: "rairacer@gmail.com",
      password: "12345"
    }

    const mockFindOne = async ({username}) => {
       const user = testData.userData.filter( user => user.username === username)[0];
       return Promise.resolve(user)
    }

    User.findOne = jest.fn(mockFindOne)

    const response = await request(app).post("/api/auth/login").send(requestBody)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('accessToken', expect.any(String))

  })

})

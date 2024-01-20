const request = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const _ = require('lodash')
const prisma = require('../prisma/prisma')
const { commentMockData } = require('../__testMockData__/commentMockData')


const mockFindCommentsByProductId = async ( prismaInputObject) => {
    const comments = commentMockData.filter( comment => comment.productId === prismaInputObject.where.productId);
    if (comments.length > 0) {
        return Promise.resolve(comments)
    } else {
        return Promise.reject(new Error("no comment found"))
    }
}

const commentPayload = {
    content: "mock content"
}


describe('[1] test  GET(api/comment/:productId) route - get all comments of one product', () => { 

    beforeEach(() => {
        jest.clearAllMocks()
        prisma.comments.findMany = jest.fn(mockFindCommentsByProductId)
      })

    test('invalid product id parameter >> should receive "invalid data" error', async() => { 

        const response = await request(app).get("/api/comment/12345687")

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual(expect.objectContaining( {errors: expect.anything()} ))
        expect(prisma.comments.findMany).not.toHaveBeenCalled()

    })

    test('valid product id and product comments found >> should receive comment list', async() => { 

        const response = await request(app).get("/api/comment/6530ed1d2c518659d50aa99a")

        expect(response.statusCode).toBe(200)
        // expect(response.body).toEqual(expect.objectContaining( {
        //     _id : "6530ed1d2c518659d50aa99a",
        //     title : "Ballon Al Rihla officiel Coupe du Monde 2022",
        //     color:  ["white", "yellow"],
        //     price: 50 
        // }))
        expect(response.body.length).toEqual(2)

    })

    test('valid product id but no comment found in database >> should receive error', async() => { 

        const response = await request(app).get("/api/comment/6530ed1d2c518659d50aa99b")

        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual(expect.objectContaining( {error: expect.any(String)} ))

    })

 })
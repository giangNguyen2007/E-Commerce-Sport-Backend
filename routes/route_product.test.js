const request = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Product = require('../models/Product')
const testData = require('../__testMockData__/userMockData')
const { productData } = require('../__testMockData__/productMockData')
const jwt = require("jsonwebtoken");
const _ = require('lodash')


const mockFindProductById = async (id) => {
    const products = productData.filter( product => product._id === id);
    if (products.length > 0) {
        return Promise.resolve(products[0])
    } else {
        return Promise.reject(new Error("no product found"))
    }
}

const productPayload = {
    title: "Mock Product",
    desc: "Mock description",
    img: "https://www.casalsport.com/img/W/CAS/ST/FB/31/09/FB3109/FB3109_ST.jpg",
    categories: [
        "ballon"
    ],
    size: [
        "5"
    ],
    color: [
        "white",
        "yellow"
    ],
    price: 50,
}


describe('[1] test  GET(/product/:id) route - get One Product by Id', () => { 

    beforeEach(() => {
        jest.clearAllMocks()
      })

    test('invalid id parameter >> should receive "invalid data" error', async() => { 

        const response = await request(app).get("/api/product/12345687")

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual(expect.objectContaining( {errors: expect.anything()} ))

    })

    test('valid id and product found in database >> should receive one product', async() => { 

        Product.findById = jest.fn(mockFindProductById)

        const response = await request(app).get("/api/product/6530ed1d2c518659d50aa99a")

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(expect.objectContaining( {
            _id : "6530ed1d2c518659d50aa99a",
            title : "Ballon Al Rihla officiel Coupe du Monde 2022",
            color:  ["white", "yellow"],
            price: 50
        }))

    })

    test('valid id and product not found in database >> should receive error', async() => { 

        Product.findById = jest.fn(mockFindProductById)

        const response = await request(app).get("/api/product/6530ed1d2c518659d50aa99b")

        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual(expect.objectContaining( {error: expect.any(String)} ))

    })

   

 })

describe('[2] test  POST(/product/) route - Create One Product', () => { 

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('Given valid data but missing access token >> Should return unauthorisation error 403', async() => { 

        Product.create = jest.fn()

        const response = await request(app)
            .post("/api/product/")
            .send(productPayload)

        expect(response.statusCode).toBe(403)
        expect(Product.create).not.toHaveBeenCalled()

    })

    test('Given valid data, but access token not from from admin >> Should return unauthorisation error 403', async() => { 

        const mockUserId = new mongoose.Types.ObjectId()

        const accessToken = jwt.sign( 
            { id: mockUserId, isAdmin: false},
            process.env.JWT_SECRET,
            { expiresIn: '3d'}
        )

        Product.create = jest.fn()

        const response = await request(app)
            .post("/api/product/")
            .set("token", `Bearer ${accessToken}`)
            .send(productPayload)

        expect(response.statusCode).toBe(403)
        expect(Product.create).not.toHaveBeenCalled()

    })



    test('Given valid data and token from admin >> Should return success', async() => { 

        const mockUserId = new mongoose.Types.ObjectId()

        const accessToken = jwt.sign( 
            { id: mockUserId, isAdmin: true},
            process.env.JWT_SECRET,
            { expiresIn: '3d'}
        )

        Product.create = jest.fn()

        const response = await request(app)
            .post("/api/product/")
            .set("token", `Bearer ${accessToken}`)
            .send(productPayload)

        expect(response.statusCode).toBe(200)
        expect(Product.create).toHaveBeenCalledWith(productPayload)

    })

})

describe('[3] test  PUT(/product/:id) route - Update One Product - Admin Authorisation required', () => { 

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('[3.1] Given unvalid data and valid admin access token>> Should return unvalid date error', async() => { 

        const mockUserId = new mongoose.Types.ObjectId()
        const mockProductId = new mongoose.Types.ObjectId()

        const unvalidProduct = _.omit(productPayload, "size")

        const accessToken = jwt.sign( 
            { id: mockUserId, isAdmin: true},
            process.env.JWT_SECRET,
            { expiresIn: '3d'}
        )

        Product.findByIdAndUpdate = jest.fn()

        const response = await request(app)
            .put("/api/product/" + mockProductId)
            .set("token", `Bearer ${accessToken}`)
            .send(unvalidProduct)

        expect(response.statusCode).toBe(400)
        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled()

    })

    test('[3.2] Given valid data and valid admin access token, but product not found >> Should return error', async() => { 

        const mockUserId = new mongoose.Types.ObjectId()
        const mockProductId = new mongoose.Types.ObjectId()
        const accessToken = jwt.sign( 
            { id: mockUserId, isAdmin: true},
            process.env.JWT_SECRET,
            { expiresIn: '3d'}
        )

        Product.findByIdAndUpdate = jest.fn(mockFindProductById)

        const response = await request(app)
            .put("/api/product/" + mockProductId)
            .set("token", `Bearer ${accessToken}`)
            .send(productPayload)

        expect(response.statusCode).toBe(500)
        // expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(mockProductId, { $set : productPayload}, { new : true })

    })

    test('[3.3] Given valid data and valid admin access token, and product found in database >> Should return success', async() => { 

        const mockUserId = new mongoose.Types.ObjectId()
        // id extracted from mock product table
        const ProductId = productData[0]._id
        const accessToken = jwt.sign( 
            { id: mockUserId, isAdmin: true},
            process.env.JWT_SECRET,
            { expiresIn: '3d'}
        )

        Product.findByIdAndUpdate = jest.fn(mockFindProductById)

        const response = await request(app)
            .put("/api/product/" + ProductId)
            .set("token", `Bearer ${accessToken}`)
            .send(productPayload)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({message: 'update successful'}))
        // expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(ProductId, { $set : productPayload }, { new : true })

    })

   
})

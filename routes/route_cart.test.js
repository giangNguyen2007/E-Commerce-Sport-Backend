const request = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const jwt = require("jsonwebtoken");
const _ = require('lodash');
const Cart = require('../models/Cart');
const { cartData } = require('../__testMockData__/cartMockData');


const cartPayload = {
    userId: "654a150fb8f9cabc42b32b2d",
    products: [
        {
            productId: "653234852c518659d50aac4c",
            color: "red",
            size: "42",
            key: "653234852c518659d50aac4c&red&42",
            quantity: 4,
        },
        {
            productId: "6530f0832c518659d50aa9a2",
            color: "white",
            size: "5",
            key: "6530f0832c518659d50aa9a2&white&5",
            quantity: 3,
        }
    ]
}

const accessToken = jwt.sign( 
    { id: cartPayload.userId, isAdmin: false},
    process.env.JWT_SECRET,
    { expiresIn: '3d'}
)


describe('[1] test  POST(/cart/:userId) route - create cart - Authorisation: same user only', () => { 

    beforeEach(() => {
        jest.clearAllMocks()
      })
    
    // mock cart insertion in database (each user can have only one cart)
    Cart.create = jest.fn((object) => {
        const carts = cartData.filter( cart => cart.userId === object.userId);
        if (carts.length > 0) {
            // if cart with userId already exist => return error
            return Promise.reject(new Error("cart with userId already exists"))
        } else {
            // if cart with userId not in database => return success
            return Promise.resolve(object)
        }
    })

    describe('Given valid user access token', () => { 

        test('[1.1] invalid cart Payload >> should receive "invalide data" error' , async() => { 

            const invalidCart = {...cartPayload, userId:"123467859"} 
    
            const response = await request(app)
                .post("/api/cart/"+ cartPayload.userId)
                .set("token", `Bearer ${accessToken}`)
                .send(invalidCart)
    
            expect(Cart.create).not.toHaveBeenCalled()
            expect(response.statusCode).toBe(400)
        })
        
        test('[1.2] valid cart Payload, no duplicate userId in database >> should receive success response', async() => { 
    
            const response = await request(app)
                .post("/api/cart/" + cartPayload.userId)
                .set("token", `Bearer ${accessToken}`)
                .send(cartPayload)
    
            expect(Cart.create).toHaveBeenCalledWith(cartPayload)
            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(cartPayload)
        })
    
        test('[1.3] valid cart Payload, but userId already in database >> should receive error', async() => { 
    
            // replace userId in cartPayload with an id alreay in database
            const cartPayloadDuplicate = {
                ...cartPayload,
                userId : "6530ecaf14cd8ef145aafa07"
            }
    
            const accessToken2 = jwt.sign( 
                { id: cartPayloadDuplicate.userId, isAdmin: false},
                process.env.JWT_SECRET,
                { expiresIn: '3d'}
            )
    
            const response = await request(app)
                .post("/api/cart/"+ cartPayloadDuplicate.userId)
                .set("token", `Bearer ${accessToken2}`)
                .send(cartPayloadDuplicate)
    
            expect(Cart.create).toHaveBeenCalledWith(cartPayloadDuplicate)
            expect(response.statusCode).toBe(500)
            expect(response.body).toHaveProperty("error")
        })
    })

    describe('Given unvalid user accessToken, all other parameters being valid', () => { 

        test('[1.4] mismatch between userId in accessToken and userId in cartPayload>> checkIdentity failed, should receive error', async() => { 
    
            const mockUserId = new mongoose.Types.ObjectId()

            const accessToken = jwt.sign( 
                { id: mockUserId, isAdmin: false},
                process.env.JWT_SECRET,
                { expiresIn: '3d'}
            )
    
            const response = await request(app)
                .post("/api/cart/"+ mockUserId)
                .set("token", `Bearer ${accessToken}`)
                .send(cartPayload)
    
            expect(Cart.create).not.toHaveBeenCalled()
            expect(response.statusCode).toBe(403)
        })

        test('[1.5] mismatch between userId in param and accessToken >> checkIdentity failed, should receive error', async() => { 
    
            const mockUserId = new mongoose.Types.ObjectId()
    
            const response = await request(app)
                .post("/api/cart/"+ mockUserId)
                .set("token", `Bearer ${accessToken}`)
                .send(cartPayload)
    
            expect(Cart.create).not.toHaveBeenCalled()
            expect(response.statusCode).toBe(403)
        })

        test('[1.5] accessToken signed with wrong secret >> checkToken middleware failed, should receive error', async() => { 

            const accessToken = jwt.sign( 
                { id: cartPayload.userId, isAdmin: false},
                "Wrong secret",
                { expiresIn: '3d'}
            )
    
            const response = await request(app)
                .post("/api/cart/"+ cartPayload.userId)
                .set("token", `Bearer ${accessToken}`)
                .send(cartPayload)
    
            expect(Cart.create).not.toHaveBeenCalled()
            expect(response.statusCode).toBe(403)
        })
    })

})



describe('[2] Test Get(/cart)', () => { 

    describe('[2.1] Test get single cart - by user', () => { 

       test('given valid accessToken >> should return user cart', () => { 


        })
        
     })
 })
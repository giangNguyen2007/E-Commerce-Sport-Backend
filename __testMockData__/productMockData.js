
// mock Product Table in MongoDB - 3 products
const productData = [
    {
        _id: "6530ed1d2c518659d50aa99a",
        title: "Ballon Al Rihla officiel Coupe du Monde 2022",
        desc: "Ce ballon est impressionnant de résistance et de qualité. Il ravira les plus grands joueurs de la planète qui évolueront au Qatar sur la plus prestigieuse des scènes, mais aussi les amateurs du monde entier.",
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
        createdAt: "2023-10-19T08:47:25.406Z",
        updatedAt: "2023-10-19T08:47:25.406Z",
        __v: 0
    },
    {
        _id: "6530f0832c518659d50aa9a2",
        title: "Ballon - Tiro Pro adidas",
        desc: "Revêtement 100 % polyuréthane qui offre un confort de jeu optimale. Technologie thermal bonding : construction thermocollée sans coutures ",
        img: "https://www.casalsport.com/img/W/CAS/ST/FB/40/10/FB4010/FB4010_ST.jpg",
        categories: [
            "ballon"
        ],
        size: [
            "3",
            "4",
            "5"
        ],
        color: [
            "white",
            "orange",
            "blue"
        ],
        price: 55,
        createdAt: "2023-10-19T09:01:55.440Z",
        updatedAt: "2023-10-19T09:01:55.440Z",
        __v: 0
    },
    {
        _id: "6530f1892c518659d50aa9a6",
        title: "Ballon Officiel FIFA Worlcup 2014",
        desc: "Revêtement 100 % polyuréthane qui offre un confort de jeu optimale. Technologie thermal bonding : construction thermocollée sans coutures ",
        img: "https://static.privatesportshop.com/img/p/1530507-4862168-thickbox.jpg",
        categories: [
            "ballon"
        ],
        size: [
            "3",
            "4",
            "5"
        ],
        color: [
            "white",
            "blue"
        ],
        price: 40,
        createdAt: "2023-10-19T09:06:17.557Z",
        updatedAt: "2023-10-19T09:06:17.557Z",
        __v: 0
    }
]

module.exports = {productData}
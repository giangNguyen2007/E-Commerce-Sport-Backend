const Product = require('../models/Product');
const prisma = require('../prisma/prisma');

const createComment = async (req, res) => {
        console.log("receive new commnent");

        try {

            const savedComment = await prisma.comments.create({
                data: req.body
            });

            console.log(savedComment);

            res.status(200).json(savedComment);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
};

const getCommentByProductId = async (req, res) => {

    try {

        const savedComment = await prisma.comments.findMany({
            where: {
                productId: req.params.productId
            },
            include: {
                // included related User
                author: {
                    select: {
                        username: true,
                    }
                }
            }
        });

        console.log(`send back user commnets in number ${savedComment.length}`);

        res.status(200).json(savedComment);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCommentById = async (req, res) => {


    try {
        const deleteComment = await prisma.comments.delete({
            where: {
                id: req.params.commentId
            }
        });

        res.status(200).json(deleteComment);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCommentByUserId = async (req, res) => {
    console.log(req.query.authorId);
    console.log(req.query.productId);

    try {
        const deleteComment = await prisma.comments.delete({
            where: {
                authorId: req.query.authorId,
                productId: req.query.productId,
            }
        });

        res.status(200).json(deleteComment);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createComment,
    getCommentByProductId,
    deleteCommentById,
    deleteCommentByUserId,
}
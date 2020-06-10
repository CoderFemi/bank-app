const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const validator = require('validator')

const bankSchema = new mongoose.Schema({
    bank: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    branchname: {
        type: String
    },
    branchaddress: {
        type: String
    }
})

const Bank = mongoose.model('Bank', bankSchema)

router.get('/banks', async (req, res) => {

    const banksPerPage = 15
    const page = req.query.page
    const removeFields = ["-_id", "-bank", "-state"]

    const banks = await Bank.find({ "bank": req.query.bank, "state": req.query.state }).collation({ locale: 'en', strength: 1 }).skip((banksPerPage * page) - banksPerPage).limit(banksPerPage).select(removeFields)

    const count = await Bank.countDocuments({ "bank": req.query.bank, "state": req.query.state }).collation({ locale: 'en', strength: 1 })
    
    try {
        res.send({ banks, count, banksPerPage })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/banks/search', async (req, res) => {
    const banksPerPage = 10
    const page = req.query.page
    const location = validator.trim(req.query.location)

    if (!location || !validator.isAlphanumeric(location)) {
        return console.log('Please provide a valid input.')
    }

    const banks = await Bank.find({
        "branchname": { "$regex": req.query.location, "$options": "i" },
        "branchaddress": { "$regex": req.query.location, "$options": "i" }
    }).skip((banksPerPage * page) - banksPerPage).limit(banksPerPage).select("-_id")

    const count = await Bank.countDocuments({
        "branchname": { "$regex": req.query.location, "$options": "i" },
        "branchaddress": { "$regex": req.query.location, "$options": "i" }
    })
    
    try {
        res.send({ banks, count, banksPerPage })

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
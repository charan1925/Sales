const express = require('express');
const router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var mongodb = require('mongodb');
const mongoose = require('mongoose');

var dummy = mongoose.Schema

const Sale = require('../../models/sales');

// POST /api/sales
router.post('/sales', (req, res) => {
    const sale = new Sale({
        _id: {

            $oid: {

                type: dummy.ObjectId,

                required: true

            },

        },

        saleDate: {

            $date: {

                $numberLong: String,

            },

        },

        items: [{

            name: String,

            tags: [String],

            price: {

                $numberDecimal: String

            },

            quantity: Number,

            _id: false




        }],

        storeLocation: String,

        customer: {

            gender: String,

            age: String,

            email: String,

            satisfaction: Number

        },

        couponUsed: Boolean,

        purchaseMethod: String
    });

    sale.save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});
const { check, validationResult } = require('express-validator');

// GET /api/sales
// router.get('/val-sales', [
//   check('page').optional().isInt(),
//   check('perPage').optional().isInt(),
//   check('storeLocation').optional().isIn(['Austin', 'New York', 'Seattle', 'Denver', 'London', 'San Diego'])
// ], (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const page = parseInt(req.query.page) || 1;
//   const perPage = parseInt(req.query.perPage) || 10;
//   const storeLocation = req.query.storeLocation;

//   // Query the database and return the results
// });

// GET /api/sales
router.get('/get/sales', (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const storeLocation = (req.query.storeLocation) ? { storeLocation: req.query.storeLocation } : {};

    Sale.find(storeLocation)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .then(sales => {
            res.status(200).json(sales);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});


// GET /api/sales/:id - Returns a specific sales object by ID
router.get('/sales/:_id',(req, res) => {
    try {
        const x = req.params._id
        Sale.findOne({_id:new ObjectId(x)})
        .then(sale => {
            if (!sale) {
                return res.status(404).send('Sale not found');
            }
            res.send(sale)
        })
        .catch(err => console.log(err))

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// PUT /api/sales/:id - Updates a specific sales object by ID
router.put('/sales-upd/:id', (req, res) => {
    Sale.updateMany(
        {sale: req.params._id},
        { $set: { purchaseMethod: req.body.purchaseMethod, saleDate: req.body.saleDate }})
        .exec()
        .then(() => {
            res.status(201).send('Purchase Method and Sales Date Updated.')
        })
        .catch((err) => { console.log(err);
        })
});

// DELETE /api/sales/:id - Deletes a specific sales object by ID
router.delete('/sales-del/:id', async (req, res) => {
    Sale.deleteOne({_id:new mongodb.ObjectId(req.params._id)})
    .exec()
    .then(() => {
        res.status(201).send('ID Deleted.')
    })
    .catch((err) => { console.log(err);
    })
});

// GET /api/sales - Returns all sales objects
router.get('/sales', async (req, res) => {
    try {
        const sales = await Sale.find();
        res.send(sales);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// GET /sales-ui
router.get('/sales-ui', (req, res) => {
    res.render('AllData');
});

router.get('/sales-find', (req, res) => {
    res.render('findID');
});

module.exports = router;

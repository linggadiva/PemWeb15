const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

// set body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// create data/insert data
app.post('/api/latrestapi', (req, res)=>{
    // buat variabel penampung data dan query sql
    const data = {...req.body};
    const querySql = 'INSERT INTO latrestapi SET ?';

    // jalankan query
    koneksi.query(querySql, data, (err, rows, field)=>{
         // error handling
        if (err) {
            return res.status(500).json({message: 'Gagal insert data!', error: err});
        }
        // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil insert data!'});
    });
});

// read data/get data
app.get('/api/latrestapi', (req, res)=>{
    //buat query sql
    const querySql = 'SELECT * FROM latrestapi';

    //jalankan query
    koneksi.query(querySql, (err, rows, field)=>{
        //error handling
        if (err) {
            return res.status(500).json({message: 'ada kesalahan', error:err});
        }
        //jika request berhasil
        res.status(200).json({success: true, data: rows});
    });
});

//update data
app.put('/api/latrestapi/:id', (req, res)=>{
    //buat variabel penampung data dan query sql
    const data = {...req.body};
    const querySearch =  'SELECT * FROM latrestapi WHERE id= ?';
    const queryUpdate = 'UPDATE latrestapi SET ? WHERE id= ?';

    //jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.id, (err, rows, field)=>{
        //error handling
        if (err) {
            return res.status(500).json({message:'ada kesalahan!', error: err});
        }

    //jika id yang dimasukkan sesuai dengan data yang ada di db
    if (rows.length) {
        //jalankan query update
         koneksi.query(queryUpdate, [data, req.params.id], (err, rows, field)=>{
            //error handling
            if (err) {
                return res.status(500).json({message:'ada kesalahan!', error: err});
            }
            //jika update berhasil
            res.status(200).json({success: true, message:'Berhasil update data!'});
            });
        } else {
            return res.status(404).json({message:'Data tidak ditemukan!', error: err});
        }
    });
});

//delete data
app.delete('/api/latrestapi/:id', (req, res)=>{
    //buat query sql untuk mencari data dan hapus 
    const querySearch = 'SELECT * FROM latrestapi WHERE id= ?';
    const queryDelete = 'DELETE FROM latrestapi WHERE id= ?';

    //jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.id, (err, rows, field)=>{
        //error handling
        if(err) {
            return res.status(500).json({message: 'ada kesalahn', error: err});
        }
    //jika id yang dimasukkan sesuai dengan data yang ada di db
    if (rows.length) {
        //jalankan query delete
        koneksi.query(queryDelete, req.params.id, (err, rows, field)=>{
            //error handling
            if (err) {
                return res.status(500).json({message:'ada kesalahan', error:err});
            }
            //jika delete berhasil
            res.status(200).json({success: true, message:'Berhasil hapus data!'});
            });
        } else {
            return res.status(404).json({message:'Data tidak ditemukan!', success: false});
        }
    });
});

// buat servernya
app.listen(PORT, ()=> console.log(`Server running at port: ${PORT}`));


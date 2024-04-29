const express = require('express')
const app = express()
const port = 3000
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContact } = require('./utils/contacts')
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())

app.get('/', (req, res) => {
    const mahasiswa = [{
        nama: "John",
        age: 10
    },
    {
        nama: "Kelly",
        age: 90
    },
    {
        nama: "Tom",
        age: 19
    }
    ]
    res.render('index', {
        mahasiswa,
        layout: 'layouts/main-layout'
    })
})

app.get('/index', (req, res) => {
    const mahasiswa = [{
        nama: "John",
        age: 10
    },
    {
        nama: "Kelly",
        age: 90
    },
    {
        nama: "Tom",
        age: 19
    }
    ]
    res.render('index', {
        mahasiswa,
        layout: 'layouts/main-layout'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout'
    })
})

app.get('/contact', (req, res) => {
    const contacts = loadContact()

    res.render('contact', {
        layout: 'layouts/main-layout',
        contacts,
        message: req.flash('message')
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',

    })
})

app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    if (!contact) {
        res.status(404)
        res.send('<h1>404</h1>')
    } else {
        deleteContact(req.params.nama)
        req.flash('message', 'Data Contact berhasil dihapus!')
        res.redirect('/contact')

    }

})

app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        contact,

    })
})

app.post('/contact/update', [
    body('nama').custom((value, { req }) => {
        const duplicate = checkDuplicate(value)
        if (value !== req.body.oldNama && duplicate) {
            throw new Error('Nama Contact sudah digunakan!')
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    body('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        })

    } else {
        updateContact(req.body)
        req.flash('message', 'Data Contact berhasil diupdate!')
        res.redirect('/contact')
    }
})

app.post('/contact', [
    body('nama').custom((value) => {
        const duplicate = checkDuplicate(value)
        if (duplicate) {
            throw new Error('Nama Contact sudah digunakan!')
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    body('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            layout: 'layouts/main-layout',
            errors: errors.array(),
        })

    } else {
        addContact(req.body)
        req.flash('message', 'Data Contact berhasil ditambahkan!')
        res.redirect('/contact')
    }
})

app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama)

    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman Detail Contact',
        contact,
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.render('invalid', {
        layout: 'layouts/main-layout'
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
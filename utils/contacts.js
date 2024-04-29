const fs = require('fs')


//membuat dan mengecek folder data
const path = './data'
console.log(`Folder data ${fs.existsSync(path) == true ? 'sudah ada' : "belum ada"}`)
if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
}

// membuat dan mengecek file contact.json
const filePath = './data/contact.json'
console.log(`File contact.json ${fs.existsSync(filePath) == true ? 'sudah ada' : "belum ada"}`)
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8')
}

const loadContact = () => {
    const contacts = JSON.parse(fs.readFileSync('data/contact.json', 'utf8'))
    return contacts
}

const findContact = (nama) => {
    const readF = loadContact()
    const contact = readF.find((arr) => arr.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

const saveContacts = (contacts) => {
    fs.writeFileSync('data/contact.json', JSON.stringify(contacts, null, 2))
}

const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

const checkDuplicate = (nama) => {
    const contacts = loadContact()
    return contacts.find((arr) => arr.nama === nama)
}

const deleteContact = (nama) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((arr) => arr.nama !== nama)
    saveContacts(filteredContacts)

}

const updateContact = (upContact) => {
    const contacts = loadContact()
    const index = contacts.findIndex((arr) => arr.nama === upContact.oldNama)
    delete upContact.oldNama
    contacts[index] = upContact
    saveContacts(contacts)
}
module.exports = { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContact }
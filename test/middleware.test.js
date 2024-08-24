import express from "express"
import request from "supertest"

// middlewares
// bikinnya sama seperti function hanya saja dia ada 3 param (req, res, next)

const middlewareSatu = (req, res, next) => {
  console.info(`Received request: ${req.method} ${req.originalUrl}`)
  next() // melanjutkan ke middleware selanjutnya atau router
}

const middlewareDua = (req, res, next) => {
  // bisa juga mengedit objek req sebelum di kelola oleh route
  req.requestTime = new Date()
  next()
}

const middlewareTiga = (req, res, next) => {
  // bisa juga bikin kondisi di middleware, jika tdk terpenuhi maka tidak di teruskan ke fungsi next()
  if(req.query.name){
    next()
  }else{
    res.status(404).end()
  }
}

const app = express()
// pakai middleware (application level middleware)
// atau middleware dibawah ini akan dijalankan di semua route path
app.use(middlewareSatu)
app.use(middlewareDua)
app.use(middlewareTiga)

// kalo mau menjalankan middleware di route tertentu
app.use("/eunha", (req, res, next) => {
  console.info(`Received request from /eunha: ${req.method} ${req.originalUrl}`)
  next()
})

app.get("/", (req, res) => {
  console.info(`Time now: ${req.requestTime.getTime().toString()}`)
  res.send(`Hello: ${req.query.name}`)
})

test("test middleware", async () => {
  const response = await request(app).get("/").query({ name: "abdu" })
  expect(response.text).toBe("Hello: abdu")
})

test("test gagal middleware", async () => {
  const response = await request(app).get("/")
  expect(response.status).toBe(404)
})

// middleware untuk membaca request body yg dikirim
app.use(express.json()) // konversi request body menjadi json
app.post("/sowon", (req, res) => {
  const name = req.body.name
  res.json({ name: `Hello ${name}` })
})

test("test request body", async () => {
  const response = await request(app).post("/sowon").send({ name: "abdu" })
  expect(response.body).toEqual({ name: "Hello abdu" })
})

// middleware 404
// jadi middleware ini akan dijalankan ketika tidak ada route yg bs diakses
app.use((req, res, next) => {
  res.status(404).send("404 not found!")
})
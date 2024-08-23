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
// pakai middleware
app.use(middlewareSatu)
app.use(middlewareDua)
app.use(middlewareTiga)

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
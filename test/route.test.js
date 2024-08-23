import express from "express"
import request from "supertest"

const app = express()

// by default custome url yg dimasukkan ke dalam app methods itu bentuknya regex
// kalo mau testing url dan langsung di generate regex nya bisa ke:
// https://forbeslindesay.github.io/express-route-tester/

app.get(/^\/abdu\/(.*)(\d)\/?$/i, (req, res) => {
  res.send(req.originalUrl)
})

app.get("/abdu2/:id(\\d+)", (req, res) => {
  res.send(`Id abdu: ${req.params.id}`)
})

test("route match", async () => {
  const response = await request(app).get("/abdu/2")
  expect(response.text).toBe("/abdu/2")
})

test("route match with parameter", async () => {
  const response = await request(app).get("/abdu2/200")
  expect(response.text).toBe("Id abdu: 200")
})

// grouping route
// ini bisa membuat routing secara independen
const router = express.Router()

// didalam router ini bs melakukan hal yg sama seperti sebelumnya
router.use((req, res, next) => {
  console.info(`Received request: ${req.method} ${req.originalUrl}`)
  next()
})

router.get("/", (req, res) => {
  res.send(`Hello ${req.query.name}`)
})

test("test grouping route", async () => {
  app.use(router) // jgn lupa ketika menggunakan group route sblm di test itu hrs di use dlu di dlm app

  const response = await request(app).get("/").query({ name: "abdu" })
  expect(response.text).toBe("Hello abdu")
})
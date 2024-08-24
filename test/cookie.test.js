import express from "express"
import request from "supertest"
import cookieParser from "cookie-parser"

const app = express()
app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
  const name = req.cookies["nama lengkap"]
  res.send(`Hello ${name}`)
})

app.post("/login", (req, res) => {
  const name = req.body.name
  res.cookie("Login", name, { path: "/" }) // bisa create cookie kita sendiri
  res.send(`Hello ${name}`)
})

test("test cookie", async () => {
  const response = await request(app).get("/")
  .set("Cookie", "nama lengkap=abdu;alamat=jakarta")

  expect(response.text).toBe("Hello abdu")
})

test("test cookie login", async () => {
  const response = await request(app).post("/login").send({ name: "abdu" })
  expect(response.get("Set-Cookie").toString()).toBe("Login=abdu; Path=/")
  expect(response.text).toBe("Hello abdu")
})
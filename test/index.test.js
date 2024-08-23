import express from "express"
import request from "supertest"

// dibawah ini contoh penggunaan route request dan juga respon

const app = express()

app.get("/", (req, res) => {
  res.send("test")
})

app.get("/abdu", (req, res) => {
  res.send(`Hello ${req.query.name}`)
})

app.get("/abdu/data", (req, res) => {
  res.json({
    path: req.path,
    originalUrl: req.originalUrl,
    hostname: req.hostname,
    protocol: req.protocol
  })
})

app.get("/abdu/data2", (req, res) => {
  if(req.query.name){
    res.status(200).send(`Berhasil!`)
  }else{
    res.status(404).end()
  }
})

// implementasi ini sama aja ketika ingin test untuk request header
app.get("/abdu/data3", (req, res) => {
  res.set({
    'Content-Type': 'json',
    'X-Author': 'abdu'
  }).end()
})

app.get("/abdu/data4", (req, res) => {
  res.set("Content-Type", "text/html")
  res.send('<html><head><title>Hello</title></title></html>')
})

test("test supertest", async () => {
  const response = await request(app).get('/')
  
  expect(response.text).toBe("test")
  expect(response.status).toBe(200);
})

test("test request with query param", async () => {
  const response = await request(app).get('/abdu').query({ name: "abdu" })
  
  expect(response.text).toBe("Hello abdu")
})

test("test request URL", async () => {
  const response = await request(app).get('/abdu/data').query({ name: "abdu" })
  
  expect(response.body).toEqual({
    path: "/abdu/data",
    originalUrl: "/abdu/data?name=abdu",
    hostname: "127.0.0.1",
    protocol: "http"
  })
})

test("test status", async () => {
  const response = await request(app).get('/abdu/data2').query({ name: "abdu" })
  const response_gagal = await request(app).get('/abdu/data2')
  
  expect(response.status).toBe(200)
  expect(response.text).toBe("Berhasil!")

  expect(response_gagal.status).toBe(404)
})

// implementasi ini sama aja ketika ingin test untuk request header
test("test respon header", async () => {
  const response = await request(app).get('/abdu/data3')
  
  expect(response.get("Content-Type")).toBe("json")
  expect(response.get("X-Author")).toBe("abdu")
})

test("test respon body", async () => {
  const response = await request(app).get('/abdu/data4')
  
  expect(response.get("Content-Type")).toContain("text/html")
  expect(response.text).toBe("<html><head><title>Hello</title></title></html>")
})
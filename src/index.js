import express from "express"
import request from "supertest"

const app = express()

// app bisa handler semua jenis http method
// kalo mau menjalankan semua method sekaligus, itu pakai: 
// app.all

app.get("/", (req, res) => {
  res.send({
    nama: "abdu",
    msg: "Helloww"
  })
})


app.listen(3000, "localhost", () => {
  console.log("Server is running!");
})
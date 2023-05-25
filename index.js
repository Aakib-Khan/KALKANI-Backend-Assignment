import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { connectDB } from './Config/DB.js'

import userRoutes from './routes/users.js'


const PORT = process.env.PORT
const app = express()

app.use(cors())
connectDB()
// app.use(express.json())
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.get("/",(req,res)=>{
    res.send(`Server Successfully Running on port ${PORT}`)

})
app.use('/user', userRoutes)


app.listen(PORT, console.log(`Server Running on ${PORT}`))
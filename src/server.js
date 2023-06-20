import express from 'express'
import {matchmaking, matchPing} from "./arena/matchmaking.js"
import bodyParser from "body-parser";
import cors from "cors"
import {corsOptions} from "../config/corsOptions.js";
import {newCharacter} from "./character/newCharacter.js";


export const jsonParser = bodyParser.json()

export const app = express().use(cors(corsOptions))

const port = 3000

matchmaking()
matchPing()
newCharacter()


app.get('/', (req, res) => {
    res.send('hello world!')
})

app.get('/stone', (req, res) => {
    res.send('stone!')
})


app.listen(port, () => {
    console.log("woho!")
})

app.get("/stream", (req, res) => {

    res.setHeader("Content-type", "text/event-stream")


    setInterval(() => {
        console.log("sending")
        res.write("data: " + "hello!\n\n")
    }, 5000)

})
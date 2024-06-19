import { Client } from "pg";
import { config } from "dotenv";
import { generateWords } from "./src/utils/generateWords";{}
import {shuffle} from "./src/utils/shuffle";
import express from "express";
import cors from "cors";
import {Word} from "./src/types/Word";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.ENVIRONMENT === 'local' ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: false,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/game/:session", async (req, res) => {
  try {
    const {session} = req.params;
    const dbres = await client.query('select word_id, word, color, ishidden from session_data where session = $1 order by data_id',[session]);

    const dbres1 = await client.query('select turn from session where session = $1',[session])

    const turn = dbres1.rows[0].turn

    res.status(201).json({
      status: "Get is working",
      data: dbres.rows,
      turn
    });

  } catch (err) {
    console.error(err.message);
  }
})

app.get("/generateSession", async (req, res) => {
  try {
    let dbres = await client.query('select gen_random_uuid()');
    const session = dbres.rows[0].gen_random_uuid;

    dbres = await client.query('select * from words');

    let text = 'INSERT INTO session(session) VALUES($1)';

    await client.query(text,[session]);

    const dbres1 = await client.query('select turn from session where session = $1',[session])

    const words = shuffle(generateWords(dbres.rows,dbres1.rows[0].turn));


    text = 'INSERT INTO session_data(session, word_id, word, color, ishidden) VALUES($1,$2,$3,$4,$5)';
    
    words.map(async element => await client.query(text, [session,element.word_id,element.word,element.color,true]))

    const turn = dbres1.rows[0].turn


    res.status(201).json({
      status: "Generating next session is working",
      session: session,
      turn
    });

  } catch (err) {
    console.error(err.message);
  }
})

app.get("/game/:session/next", async (req,res) =>{
  try {
    const {session} = req.params;

    await client.query("DELETE FROM session_data WHERE session = $1", [
      session
    ]);

    let dbres = await client.query('select * from words');

    const dbres1 = await client.query('select turn from session where session = $1',[session])

    await client.query('UPDATE session SET turn = $1 WHERE session = $2',[!dbres1.rows[0].turn,session]);

    const words = shuffle(generateWords(dbres.rows,!dbres1.rows[0].turn));

    const text = 'INSERT INTO session_data(session, word_id, word, color, ishidden) VALUES($1,$2,$3,$4,$5)';
    
    words.map(async element => await client.query(text, [session,element.word_id,element.word,element.color,true]))
    
    dbres = await client.query('select word_id, word, color, ishidden from session_data where session = $1 order by data_id',[session]);

    const turn = !dbres1.rows[0].turn

    res.status(201).json({
      status: "Next seems to be working",
      data: dbres.rows,
      turn
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/game/:session", async (req, res) => {
  try {
    const { session } = req.params;
    let text = 'UPDATE session_data SET ishidden = $1 WHERE session = $2 and word_id = $3'
    const [turn,data] = req.body;
    if(data){
      data.map(async (element: Word) => await client.query(text,[false,session,element.word_id]))
    }

    text = 'UPDATE session SET turn = $1 WHERE session = $2'
    await client.query(text,[turn,session])

    res.json("Session data was updated!");
  } catch (err) {
    console.error(err.message);
  }
});


// app.post("/download", async (req,res) => {
//   try {
//     const text = 'INSERT INTO words(word) VALUES($1)';
  
//     words.words.map(async element => await client.query(text, [element]))

//     // console.log(words.words)
//     res.status(201).json({
//       status: "success"
//     });
  
//   } catch (err) {
//     console.error(err.message);
//   }
// });


//Start the server on the given port

const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

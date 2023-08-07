import express, { response } from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "ashish";
const yourPassword = "123";
const yourAPIKey = "2717f160-5fe3-4a6b-93ee-1cf1aac07a11";
const yourBearerToken = "81123ec0-fd9a-4ef6-a747-dc39413d712f";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth",async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  try {
     let response= await axios.get("https://secrets-api.appbrewery.com" + "/random");
    let result= await response.data;
    res.render("index.ejs",{result})
  } catch (error) {
    res.render("index.ejs", { error });
  }

  // GET 
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth", (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908

  const usernamePasswordBuffer = Buffer.from(yourUsername + ":" + yourPassword);
  const base64data = usernamePasswordBuffer.toString('base64');
  const axiosObject = axios.create({
    headers: {
      'Content-Type': 'application/json',
        'Authorization': `Basic ${base64data}`,
    }
  })


   axios.get("https://secrets-api.appbrewery.com/generate-api-key", {
     auth: {
       axiosObject,
     },
   }).then(async(elem)=>{
     const info = elem;
     const user = info.data;
         const basic =await axios.get(
            "https://secrets-api.appbrewery.com/" +
              `filter?score=5&apiKey=${user.apiKey}`
          );
          let ret= basic
          let final = ret.data;
          res.render("index.ejs", {
            result: final[Math.floor(Math.random() * final.length)],
          });
         
      }).catch((err)=>{
       console.log(err);
      })
   });

app.get("/apiKey",async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
    try {
     let apiRes = await axios.get(
        `https://secrets-api.appbrewery.com/filter?score=5&apiKey=${yourAPIKey}`
      )
     let result= apiRes.data;
       res.render("index.ejs", {
         result: result[Math.floor(Math.random() * result.length)],
       });

    } catch (error) {
      console.log(error);
    } 
  
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  
  axios
    .get("https://secrets-api.appbrewery.com/secrets/42", {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      },
    })
    .then((elem) => {
      let result = elem.data;
      res.render("index.ejs", {
        result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

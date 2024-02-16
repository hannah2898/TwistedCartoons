const express = require("express"); //including or importing express in this app
const { request } = require("http");
const path = require("path"); //module to help with file path
const{MongoClient} = require("mongodb");//import MongoCient for mongodb

//DB values
// const dbUrl = "mongodb://127.0.0.1:27017/twistedcartoons";
const dbUrl = "mongodb+srv://admin:7BkZCgRsy5wIOyeU@cluster0.tngu5c3.mongodb.net/";
// const dbUrl = "mongodb://dbuser:Test123!!@127.0.0.1:27017/?authSource=twistedcartoons";
const client = new MongoClient(dbUrl);


const app = express(); //Create an express app
const port = process.env.PORT || "8888"; //PORT is environment variable for process

//SET UP TEMPLATE ENGINES (PUG)

//first views = the views of this app | second views = views folder
app.set("views",path.join(__dirname,"views")); //set up "views" setting to look in the <__dirname>/views  folder
app.set("view engine","pug");//set up app to use Pug template engine

//SET UP A PATH FOR STATIC FILES
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));

//SET UP SOME PAGE ROUTES
app.get("/",(request,response) =>{
    //response.status(200).send("Test page again"); //This is to test
    response.render("index",{title:"Home"});
});
app.get("/products",(request,response)=>{
    response.render("products",{title:"Products"});
});
app.get("/aboutus",async(request,response)=>{
    //test getReviews()

     let reviews =await getReviews();
     console.log(reviews);
    response.render("aboutus",{title:"About Us",feedback:reviews });
});
app.post("/aboutus/addreview/submit",async(request,response)=>{
    //retrieve values from Submitted form here
    let nme= request.body.username;
    let review= request.body.review;
    let rating=request.body.rating;
    console.log(rating);
    let newReview={
        "username":nme,
        "comment":review,
        "rating":rating
    };
    await addReview(newReview);
    response.redirect("/aboutus");

});
app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`)
});

//MongoDB Functions
async function connection(){
    db = client.db("TwistedCartoons");
    return db;
}
//Function to select all documents in the reviews collection
async function getReviews(){
    db = await connection();
    let results = db.collection("Reviews").find({});
    let res = await results.toArray();
    return res;
}
//Function to insert one review
async function addReview(reviewData){
    db = await connection();
    let status = await db.collection("Reviews").insertOne(reviewData);
    console.log("review added")
}
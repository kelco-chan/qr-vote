const express = require("express");
const ejs = require("ejs");
const app = express();
const cookieParser = require('cookie-parser')
const Artwork = require("./db/artwork");
//wait for artworks to load
Artwork.loadAll();
app.set("view engine","ejs");
app.use(cookieParser());
app.get("/",function(req,res){
    res.render("pages/index",{ejs:true})
});
app.get("/leaderboard",function(_,res){res.render("pages/leaderboard")})
app.get("/icon/:id",(req,res)=>{
    let art = Artwork.find(req.params.id);
    if(!art){
        res.status(404).render("pages/error",{code:404,message:"we couldn't find the artwork that you are trying to vote for."});
    }else{
        res.sendFile(art.iconFile);
    }
})
app.get("/vote/:id",(req,res)=>{
    let artwork = Artwork.find(req.params.id);
    if(!artwork){
        res.status(404).render("pages/error",{code:404,message:"we couldn't find the artwork that you are trying to vote for."});
    }else{
        res.render("pages/vote",{voted:false,...artwork.serialise()});
    }
});
app.get("/voteconfirm/:id",(req,res)=>{
    let artwork = Artwork.find(req.params.id);
    if(req.cookies.voted === "true"){
        res.status(403).render("pages/error",{code:403,message:"you have voted already."});
    }else if(!artwork){
        res.status(404).render("pages/error",{code:404,message:"the artwork doesn't exist."});
    }else{
        artwork.votes += 1;
        Artwork.saveAll();
        res.cookie("voted","true");
        res.render("pages/vote",{voted:true,...artwork.serialise()});
    }
});
//JSON Endpoint
app.get("/artworks",(req,res)=>{
    let sorted = Artwork.all.map(a=>a.serialise()).sort((a,b)=>(b.votes-a.votes));
    res.status(200).type("json").end(JSON.stringify(sorted));
});
app.use("/static",express.static("static"))
app.listen(3000)//.then(()=>{console.log("Hosted on port 3000")})
setInterval(function(){
    Artwork.loadAll();
},10000)
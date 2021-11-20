const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const ejs = require("ejs");
const moment = require("moment");

mongoose.connect("mongodb+srv://ishita-admin:rajitritu321@cluster0.aahcc.mongodb.net/utilityOneDB");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const flashCardSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

const Flashcard = mongoose.model("Flashcard", flashCardSchema);

const collectionSchema = new mongoose.Schema({
  name: String,
  cards: [flashCardSchema],
});

const Collection = mongoose.model("Collection", collectionSchema);

const f1 = new Flashcard({
  question: "This is the first sample question",
  answer: "This is the sample answer",
});

const f2 = new Flashcard({
  question: "This is the second sample question",
  answer: "This is the sample answer",
});

const f3 = new Flashcard({
  question: "This is the third sample question",
  answer: "This is the sample answer",
});

defaultArrayCards = [f1, f2, f3];

Flashcard.find({}, (err, objs) => {
  if (objs.length === 0) {
    Flashcard.insertMany(defaultArrayCards);
  }
});

const item1 = new Collection({
  name: "Sample Collection",
  cards: defaultArrayCards,
});

const todoItemSchema = new mongoose.Schema({
  name: String
})

const Todo = mongoose.model('Todo', todoItemSchema);

const todo1 = new Todo({
  name: "This is your Todo-List"
})

const todo2 = new Todo({
  name: "Add your todo-items and start working! :)",
});

const todo3 = new Todo({
  name: "Hit the checkbox to delete an item, once you have done it!",
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/pomodoro", (req, res) => {
  res.render("pomodoro");
});

app.get("/collections", (req, res) => {
  Collection.find({}, (err, objs) => {
    if (objs.length === 0) {
      item1.save(()=>{
        res.redirect("/collections");
      });
    } else {
      if (!err) res.render("collections", { collections: objs });
    }
  });
});

app.post("/collections", (req, res) => {
  let collectionName = req.body.collectionName;

  Collection.findOne({ name: collectionName }, (err, obj) => {
    if (obj) res.redirect("/collections");
    else {
      const newCollection = new Collection({
        name: collectionName,
        cards: [],
      });

      newCollection.save(function () {
        res.redirect("/collections");
      });
    }
  });
});

app.post("/collections/delete", (req, res) => {
  Collection.deleteOne({ _id: req.body.delete }, () => {
    res.redirect("/collections");
  });
});

app.get("/collections/:colID", (req, res) => {
  collectionID = req.params.colID;

  Collection.findOne({ _id: collectionID }, (err, obj) => {
    res.render("flashcards", { flashcards: obj.cards, colID: collectionID });
  });
});

app.get("/createFlashcard/:colID", (req, res) => {
  let colID = req.params.colID;
  res.render("createFlashcard", { colID: colID });
});

app.post("/createFlashcard/:colID", (req, res) => {
  Collection.findOne({ _id: req.params.colID }, (err, obj) => {
    if (!err) {
      const newFlashcard = new Flashcard({
        question: req.body.question,
        answer: req.body.answer,
      });

      newFlashcard.save();

      obj.cards.push(newFlashcard);
      obj.save(()=>{
        res.redirect("/collections/" + req.params.colID);
      });

    }
  });
});

const platforms = require("./platforms.json");

app.get("/platforms", (req, res) => {
  res.render("platforms", { platforms: platforms });
});

let id = 0;
let name = "";

app.get("/platforms/:id", (req, res) => {
  id = req.params.id;
  platforms.forEach((el) => {
    if (id == el.code) {
      name = el.name;
      console.log(name);
    }
  });
  res.redirect("/type");
});

app.get("/type", (req, res) => {
  res.render("type");
});

let type = "";
let today = new Date().toISOString();

app.post("/type", (req, res) => {
  type = req.body.type;

  if (type == "1") {
    const url =
      "https://clist.by:443/api/v2/json/contest/?resource_id=" +
      id +
      "&start__lte=" +
      today +
      "&end__gt=" +
      today +
      "&order_by=start&username=ishitac2604&api_key=5e1257432d47a7c6d6e2798d33f6c6cc2e2d102e";

    https.get(url, (response) => {
      response.on("data", (data) => {
        d = JSON.parse(data);
        if (d.objects.length === 0) {
          res.send(
            "<h1>Sorry, no live contests! Check back again later :) </h1>"
          );
        } else {
          res.render("contests", { contests: d.objects, name: name });
        }
      });
    });
  } else {
    const url =
      "https://clist.by:443/api/v2/json/contest/?resource_id=" +
      id +
      "&start__gte=" +
      today +
      "&order_by=start&username=ishitac2604&api_key=5e1257432d47a7c6d6e2798d33f6c6cc2e2d102e";

    console.log(url);
    https.get(url, (response) => {
      response.on("data", (data) => {
        d = JSON.parse(data);
        if (d.objects.length === 0) {
          res.send(
            "<h1>Sorry, no contests available! Check back again later :)</h1>"
          );
        } else {
          res.render("contests", { contests: d.objects, name: name });
        }
      });
    });
  }
});

app.get('/todo', (req,res)=>{

  Todo.find({},(err,objs)=>{
    if(objs.length === 0){
      Todo.insertMany([todo1,todo2,todo3],()=>{
        res.redirect('/todo')
      })
    }else{
      res.render("todo", {listTitle: new Date().toLocaleDateString(), newItem: objs});
    }
  })

})

app.post('/todo',(req,res)=>{
  const itemDoc = new Todo({
    name: req.body.newItem
  })

  itemDoc.save(()=>{
    res.redirect('/todo')
  });
})
app.post('/todo/delete',(req,res)=>{
  let id = req.body.checked
  Todo.deleteOne({_id: id},(err)=>{
    if(!err) res.redirect('/todo')
    else res.send(err)
  })
})
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});

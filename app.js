const express = require ("express"); 
const bodyParser = require ("body-parser"); 
const mongoose = require ("mongoose");
const _ = require('lodash');

const app = express (); 
 
app.set ("view engine", "ejs"); 
 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static("public")); 
 
mongoose.connect("mongodb+srv://admin-matheus:btavlr321@cluster0.smvokdf.mongodb.net/todoListDB" , {useNewUrlParser: true});
 
const itemsSchema = {
  name: String
}; 
 
const Item = mongoose.model("item", itemsSchema); 
 
const item1 = new Item({
  name:"work"
});
 
const item2 = new Item({
  name:"play"
});
 
const item3 = new Item({
  name:"gym"
});

const listSchema = {
  name:String,
  items:[itemsSchema]
};
 
const defaultItems = [item1, item2, item3];

const List = mongoose.model("List", listSchema);
 
app.get("/", function (req,res) {


  //printing all store values in terminal (In my case Hyper Terminal)
  Item.find({})
    .then(foundItem => {
      if (foundItem.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItem;
      }
    })
    .then(savedItem => {
      res.render("list", {
        listTitle: "Today",
        newListItems: savedItem
      });
    })
    .catch(err => console.log(err));

 
  //res.render("list", {listTitle:"Today", newListItems:defaultItems});
 
});
 
app.post("/", (req, res) => {

  let itemName = req.body.newItem

  let listName = req.body.list.trim()  // Remove leading/trailing spaces



  const item = new Item({

      name: itemName,

  })



  if (listName === "Today") {

      item.save()

      res.redirect("/")

  } else {

      List.findOne({ name: listName }).exec().then(foundList => {

          if (foundList) {
              foundList.items.push(item)
              foundList.save()
              res.redirect("/" + listName)
          } else {
              const newList = new List({
                  name: listName,
                  items: [item],
              })
              newList.save()
              res.redirect("/" + listName)
          }
      }).catch(err => {
          console.log(err);
      });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
 
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId)
      .then(function () {
        res.redirect("/");
      })
      .catch(function () {
        console.log("delete error");
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then(function (foundList) {
        res.redirect("/" + listName);
      })
      .catch(function (err) {
        console.log("err in delete item from custom list");
      });
  }
});

app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
 
  List.findOne({name:customListName})
    .then(function(foundList){
        
          if(!foundList){
            const list = new List({
              name:customListName,
              items:defaultItems
            });
          
            list.save();
            console.log("saved");
            res.redirect("/"+customListName);
          }
          else{
            res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
          }
    })
    .catch(function(err){});
});

app.get("/about", function(){
  res.render("about"); 
});
 
app.listen(3000, function (){
  console.log("Server started on port 3000");
});
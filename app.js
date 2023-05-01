const express = require ("express"); 
const bodyParser = require ("body-parser"); 
const mongoose = require ("mongoose"); 
 
const app = express (); 
 
app.set ("view engine", "ejs"); 
 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static("public")); 
 
mongoose.connect("mongodb://0.0.0.0:27017/todoListDB" , {useNewUrlParser: true});
 
const itemsSchema = {
  name: String
}; 
 
const Item = mongoose.model("item", itemsSchema); 
 
const item1 = new Item ({
  name: "Welcome to your to do list!"
}); 
 
const item2 = new Item ({
  name: "Hit the + button to add a new item."
}); 
 
const item3 = new Item ({
  name: "<- Hit this to delete an item."  
}); 
 
const defaultItems = [item1, item2, item3]; 
 
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
 
app.post("/", function (req,res){
 
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
 
});
 
app.get("/about", function(){
  res.render("about"); 
});
 
app.listen(3000, function (){
  console.log("Server started on port 3000");
});
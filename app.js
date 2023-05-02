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
 
app.post("/", function (req,res){
 
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
 
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox.trim();

  Item.findByIdAndRemove(checkedItemId)
  .then(() => {
      console.log("Succesfully deleted checked item from the database");
      res.redirect("/");
  })
  .catch((err) => {
      console.log(err);
  })
});

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;
 
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
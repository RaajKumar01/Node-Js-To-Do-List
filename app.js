const express = require("express");
const mongoose = require('mongoose');

const app = express();

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect('mongo db connection url', { useNewUrlParser: true } );

const header = "Today";

const ItemSchema = {
  name: String
}

const toDoItems = mongoose.model('Items', ItemSchema);


app.get('/', (req, res) => {

   toDoItems.find({}, function(err, foundItems){
    
    res.render('to-do', {items: foundItems, header: header});

   });
   
});

app.post('/', (req, res) => {


  if(req.body.addButton === "addItem") {

       const Additem = new toDoItems({
         name: req.body.toDoItem
       })
       
       Additem.save();
  }
  else if(req.body.clearButton === "clearItems")
  {
      toDoItems.find({}, function(err, foundItems){
      
      if(foundItems.length > 0)
          toDoItems.deleteMany({}, function(err) {
               if(err) console.log(err)
          });
      });
  }

  res.redirect('/');

});

app.post('/checkitem', (req, res) => {

      if(req.body.bDeleteItem) 
      {
          toDoItems.findByIdAndRemove(req.body.bDeleteItem, (err) => {
            if(!err) {
              console.log("Item Deleted: " + req.body.bDeleteItem);
              res.redirect('/')
            }
            else console.log("Error while deleting an item: " + err);
          });
      }
});

app.listen(port , () => {

    console.log("Sever is running in port: " + port);
});

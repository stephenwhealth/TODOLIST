const express = require("express")
const mongoose= require("mongoose")
const port = 3044;
const app = express()
app.use(express.json());

const shoppingcart = new mongoose.Schema ( {
    name:String,
    price:Number,
})

const item = mongoose.model("shopping", shoppingcart)

app.get("/",(req,res) => {
    res.status(200).json("welcome to shopping cart")

})

// adding an item to cart

app.post("/addingitem", async(req, res)=>{
    const newitem = await new item (req.body);
    newitem.save()

    res.status(200).json(newitem)
})


// check all item

app.get("/allitems", async(req, res) =>{
    const all = await item.find();

    res.status(200).json({
        message: "the list of items bought" + all.length, data:all
    })
})

// geting an item

app.get("/checkoneitem/:id", async(req, res) =>{
    const id = req.params.id
    const oneitem = await item.findById(id)
    // console.log(oneuser)

    res.status(200).json({
        message: `the information of user id: ${id}`, 
        data: oneitem
    })
})


// removing an item

app.delete("/removeitem/:id", async(req, res) =>{
    const id = req.params.id
    const removeitem = await item.findByIdAndDelete(id)
        
        res.status(200).json({
            message: `the deleted user is recongnised with id: ${id}`,
            data: removeitem
    })

})

// replace item in cart

app.put("/changeitem/:id", async(req, res)=>{
    const id = req.params.id
    const replace = await item.findByIdAndUpdate(id, req.body);
    replace.save()

    res.status(200).json({
        message: `the data taged with id: ${id} has been updated`,
        data: replace
    })
})


mongoose.connect("mongodb+srv://ujunwastephen8:rARbdqyyfOzwPgLo@cluster0.tdmydgt.mongodb.net/").then( ()=>{
console.log("connection is successful")
})

app.listen(port, ()=>{
    console.log(`server is listen on port ${port}`)
})
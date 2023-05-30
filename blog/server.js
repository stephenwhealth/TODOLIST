const express = require('express')
const PORT = 5050;
const fs = require('fs')

const app = express()
app.use(express.json());


app.get("/",(req,res)=>{
    res.json({
        status: "ok",
        message: "welcome to my new service"
    })
})

// readdatabase

const mydata = () => {
    const database= fs.readFileSync("./blogs.json");
    return JSON.parse(database);
}

// write to database
const writeDatabase = (data) => {
    fs.writeFileSync("./blogs.json", JSON.stringify(data))
}

// read all post

app.get("/post",(req,res)=>{
    const user = mydata()
    res.json({
        data: user,
        message: "posts of the day"
    })
});

// getting a post by id

app.get("/post/:id",(req,res) =>{
    const datas = mydata();
    const userId = parseInt(req.params.id);
    const user = datas.post.find((item) => (item.id === 
        userId));
        if(!user) {
            res.status(404).json({
                message: "user not found"
            });
        }else{
            res.status(200).json({
                data: user
            })

        }
});

// posting a blog

app.post("/post", (req,res) => {
    const adding = mydata();
    const newUser = req.body;
    newUser.id = adding.post.length + 1;
    adding.post.push(newUser);
    writeDatabase(adding);
    res.status(200).json({
        newData: newUser
    });
});

// deleting a post

app.delete("/post/:id", (req,res) => {
    const database = mydata();
    const userId = parseInt(req.params.id)
    const index = database.post.findIndex((i) => (i.id === userId))
    if (!database.post[0]) {
        res.status(404).json({
            message: `this id: ${userId} does not exist`
        })
    }else {
        deletedUser = database.post[index]
        database.post.splice(index, 1)
        writeDatabase(database);
        res.status(200).json ({
            deletedData: deletedUser
        })
    }
});


// Updating a post

app.put("/post/:id", (req,res) => {
    const database = mydata();
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const index = database.post.findIndex((i) => (i.id === userId));
    if(index !== -1){
        database.post[index] = {...database.post[index], ...updatedUser}
        writeDatabase(database)
        res.status(200).json ( {
            data: database.post[index]
        });
    }else {
        res.send("wrong id sent")
    }
    });



app.listen(PORT, ()=>{
    console.log(`app is listening to port: ${PORT}`)
})
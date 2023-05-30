const express = require('express')
const PORT = 2903;
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
    const database= fs.readFileSync("./list.json");
    return JSON.parse(database);
}

// write to database
const writeDatabase = (data) => {
    fs.writeFileSync("./list.json", JSON.stringify(data))
}

// read all data

app.get("/TODO",(req,res)=>{
    const user = mydata()
    res.json({
        data: user,
        message: "list of todolist"
    })
});

// getting a particular id

app.get("/TODO/:id",(req,res) =>{
    const datas = mydata();
    const userId = parseInt(req.params.id);
    const user = datas.TODO.find((item) => (item.id === 
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

// adding to a schedule

app.post("/TODO", (req,res) => {
    const adding = mydata();
    const newUser = req.body;
    newUser.id = adding.TODO.length + 1;
    adding.TODO.push(newUser);
    writeDatabase(adding);
    res.status(200).json({
        newData: newUser
    });
});

// deleting a schedule

app.delete("/TODO/:id", (req,res) => {
    const database = mydata();
    const userId = parseInt(req.params.id)
    const index = database.TODO.findIndex((i) => (i.id === userId))
    if (!database.TODO[0]) {
        res.status(404).json({
            message: `this id: ${userId} does not exist`
        })
    }else {
        deletedUser = database.TODO[index]
        database.TODO.splice(index, 1)
        writeDatabase(database);
        res.status(200).json ({
            deletedData: deletedUser
        })
    }
});


// Update a schedule

app.put("/TODO/:id", (req,res) => {
    const database = mydata();
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const index = database.TODO.findIndex((i) => (i.id === userId));
    if(index !== -1){
        database.TODO[index] = {...database.TODO[index], ...updatedUser}
        writeDatabase(database)
        res.status(200).json ( {
            data: database.TODO[index]
        });
    }else {
        res.send("wrong id sent")
    }
    });



app.listen(PORT, ()=>{
    console.log(`app is listening to port: ${PORT}`)
})
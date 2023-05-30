const express = require('express')
const PORT = 3398;
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
    const database= fs.readFileSync("./records.json");
    return JSON.parse(database);
}

// write to database
const writeDatabase = (data) => {
    fs.writeFileSync("./records.json", JSON.stringify(data))
}

// read all data

app.get("/employeedetails",(req,res)=>{
    const user = mydata()
    res.json({
        data: user,
        message: "list of todolist"
    })
});

// getting a particular id

app.get("/employeedetails/:id",(req,res) =>{
    const datas = mydata();
    const userId = parseInt(req.params.id);
    const user = datas.employeedetails.find((item) => (item.id === 
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

// adding a new employee details

app.post("/employeedetails", (req,res) => {
    const adding = mydata();
    const newUser = req.body;
    newUser.id = adding.employeedetails.length + 1;
    adding.employeedetails.push(newUser);
    writeDatabase(adding);
    res.status(200).json({
        newData: newUser
    });
});

// deleting a schedule

app.delete("/employeedetails/:id", (req,res) => {
    const database = mydata();
    const userId = parseInt(req.params.id)
    const index = database.employeedetails.findIndex((i) => (i.id === userId))
    if (!database.employeedetails[0]) {
        res.status(404).json({
            message: `this id: ${userId} does not exist`
        })
    }else {
        deletedUser = database.employeedetails[index]
        database.employeedetails.splice(index, 1)
        writeDatabase(database);
        res.status(200).json ({
            deletedData: deletedUser
        })
    }
});


// Update a schedule

app.put("/employeedetails/:id", (req,res) => {
    const database = mydata();
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const index = database.employeedetails.findIndex((i) => (i.id === userId));
    if(index !== -1){
        database.employeedetails[index] = {...database.employeedetails[index], ...updatedUser}
        writeDatabase(database)
        res.status(200).json ( {
            data: database.employeedetails[index]
        });
    }else {
        res.send("wrong id sent")
    }
    });



app.listen(PORT, ()=>{
    console.log(`app is listening to port: ${PORT}`)
})
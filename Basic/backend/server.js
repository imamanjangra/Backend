import express from 'express';

const app = express()

// app.get("PATH" , (request , response) => {
//     res.send("") 
// })

app.get('/' , (req , res) => {
    res.send("server is ready")
});

app.get("/api/data" , (req , res) => {
    const data = [
        {
            id : 1,
            Name : "Aman",
        },
        {
            id : 2,
            Name : "Tarun",
        },
        {
            id : 3,
            Name : "Anuj",
        },
        {
            id : 4,
            Name : "Ankush",
        },

    ]

    res.send(data)
})

app.get("/info" , (req , res)=> {
    res.send("This is info");
})
const Port = process.env.PORT || 3000;

app.listen(Port , () => {
    console.log(`server at http://localhost:${Port}`);
})
const serverless = require('serverless-http');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({strict: false}));

app.get('/', function(req, res){
    res.send('Hello World')
})


//Get user endpoint

app.get('/users/:userId', function(req, res){
    const params = {
        TableName: USERS_TABLE,
        key:{
            userId: req.params.userId,
        },
    }

    dynamoDb.get(params,(error, result) =>{
        if(error){
            console.log(error);
            res.status(400).json({error: "User not found"});
        }
    });
})

//User Endpoint
app.post('/users', function(req,res){
    const {userId, name} = req.body;
    if(typeof userId !== 'string'){
        res.status(400).json({error:'"userId" muyst be a string'});
    } else if (typeof name !== 'string'){
        res.status(400).json({error: '"name" must be a string'});
    }

    const params = {
        TableName: USERS_TABLE,
        Item:{
            userId:usersId,
            name:name,
        }
    };

    dynamoDb.put(params, (error) =>{
        if(error){
            console.log(error);
            res.status(400).json({error: 'could not create user'});
             }
             res.json({userId, name});
    });
})


module.exports.handler = serverless(app);
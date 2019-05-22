import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
config();
AWS.config.update({ region: process.env.AWS_REGION });
type DDBActions = 'put' | 'update' | 'get' | 'delete' | 'scan' | 'query';
type DDBInput = AWS.DynamoDB.DocumentClient.PutItemInput | AWS.DynamoDB.DocumentClient.DeleteItemInput | AWS.DynamoDB.DocumentClient.UpdateItemInput | AWS.DynamoDB.DocumentClient.QueryInput | AWS.DynamoDB.DocumentClient.GetItemInput | AWS.DynamoDB.DocumentClient.ScanInput;
const call = (action: DDBActions, params: DDBInput) => {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    switch(action) {
        case 'delete': return dynamoDb.delete(params as AWS.DynamoDB.DocumentClient.DeleteItemInput).promise();
        case 'put': return dynamoDb.put(params as AWS.DynamoDB.DocumentClient.PutItemInput).promise();
        case 'update': return dynamoDb.update(params as AWS.DynamoDB.DocumentClient.UpdateItemInput).promise();
        case 'scan': return dynamoDb.scan(params).promise();
        case 'query': return dynamoDb.query(params).promise();
        case 'get': return dynamoDb.get(params as AWS.DynamoDB.DocumentClient.GetItemInput).promise();
        default: return dynamoDb.get(params as AWS.DynamoDB.DocumentClient.GetItemInput).promise();
    }
};

export default call;

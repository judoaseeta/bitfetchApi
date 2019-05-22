import { CognitoUserPoolTriggerHandler,APIGatewayEvent, APIGatewayProxyEvent ,Handler } from 'aws-lambda';
import * as aws from 'aws-sdk';
import { v1 } from 'uuid';
import {failure, success} from './utils/response';
import ddb from './utils/ddb';
export const load: Handler = async(event: APIGatewayProxyEvent, context) => {
  const accountParams: aws.DynamoDB.DocumentClient.GetItemInput = {
      TableName: 'account',
      Key: {
          userId: event.requestContext.identity.cognitoIdentityId
      },
  };
  const transactionParams: aws.DynamoDB.DocumentClient.QueryInput = {
      TableName: 'transaction',
      KeyConditionExpression : "userId = :uId",
      ExpressionAttributeValues: {
          ':uId' :  event.requestContext.identity.cognitoIdentityId
      },
  };
  try {
      const { Item } = await ddb('get', accountParams) as aws.DynamoDB.DocumentClient.GetItemOutput;
      if(Item) {
          const { Count } = await ddb('query',transactionParams) as aws.DynamoDB.DocumentClient.QueryOutput;
            return success({
                account: Item,
                transactionNumber: Count
            });
      } else {
          return failure({ status: false, error: "Item not found"});
      }
  } catch (e) {
      return failure({ message: e.message, status: false});
  }
};
export const create: Handler = async (event: APIGatewayProxyEvent, context, callback) => {
    const params: aws.DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'account',
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            amount: 200000,
        },
    };
    try {
        await ddb('put', params) as aws.DynamoDB.DocumentClient.PutItemOutput;
        return success(params.Item);
    } catch(e) {
        return failure({ message: e.message , status: false});
    }
};
// 용어의 수정 필요.

export const update:Handler = async(event: APIGatewayProxyEvent, context, callback) => {
    const body = JSON.parse(event.body!);
    const tradeType = body.type;
    const tradeAmount = Number((body.price * body.quantities).toFixed(4));
    const cognitoIdentityId = event.requestContext.identity;
    const accountParams: aws.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: 'account',
        Key: {
            userId: cognitoIdentityId
        },
        UpdateExpression: tradeType === 'BUY' ? 'SET #am = #am - :tam' : 'SET #am = #am + :tam',
        ConditionExpression: '#am >= :tam',
        ExpressionAttributeNames: {
            '#am': 'amount',
        },
        ExpressionAttributeValues: {
            ':tam': tradeAmount,
        },
        ReturnValues: "ALL_NEW",
    };
    const transactionParams: aws.DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'transaction',
        Item: {
            userId: cognitoIdentityId,
            currency: body.currency,
            type: tradeType,
            date: Date.now(),
            tradeId: v1(),
            quantities: body.quantities,
            price: body.price,
        },
    };
    try {
        const newData = await ddb('update', accountParams) as aws.DynamoDB.DocumentClient.UpdateItemOutput;
        if(newData) {
            await ddb('put', transactionParams) as aws.DynamoDB.DocumentClient.PutItemOutput;
        }
        return success({ status: true});
    } catch(e) {
        return failure( { message: e.message , status: false});
    }
};

import {dynamodb} from "../../dynamodb";

interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }
async function getUser(email: string) {
  //Search through Dynamo DB for user
  //If user found, return the user
  //If user not found, return false
  const params = {
    TableName: process.env.AWS_DYNAMO_TABLE,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "email",
    },
    ExpressionAttributeValues: {
      ":pk": email
    },
  };

  try {
    const result = await dynamodb.query(params).promise();
    console.log('USER LOOKUP RESULT BELOW')
    console.log(result)
    return result.Items[0]
  } catch (error) {
    console.log("ERROR WHEN FINDING USER")
    console.log(error);
    return undefined
  }
}

interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  }

async function createUser(email: string, firstName: string, lastName: string, username?: string, password?: string){
    const params = {
        TableName: process.env.AWS_DYNAMO_TABLE,
        Item: {
          email,
          firstName,
          lastName,
          username:  username || firstName,
          password: password || "",
          plants:"[]" // Empty JSON array attribute
        },
      };
      console.log(params)
    
      try {
        await dynamodb.put(params).promise();
        console.log('User created successfully');
        return true
      } catch (error) {
        console.error('Error creating item:', error);
        return false
      }
    }
 

 const dbOperations = {createUser,getUser}

 export default dbOperations

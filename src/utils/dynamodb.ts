import AWS from "aws-sdk";
import bcrypt from "bcrypt";

export interface PlantModel {
  id: string;
  birthday: number;
  name: string;
  nickname?: string;
  plantType: "Outdoor" | "Indoor";
  plantSize: "L" | "M" | "S";
  waterNeeded: number;
  waterAdded?: number;
  image?: string;
}
export interface UserModel {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
  username: string;
  password: string;
  plants: PlantModel[];
}

interface SavedUser {
  email: string;
  details: string;
  password: string;
}
// Configure the AWS SDK with your credentials and desired region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_DYNAMO,
});

// Create an instance of the DynamoDB DocumentClient
const dynamodb = new AWS.DynamoDB.DocumentClient();
export async function getUser(email: string, requestType?: string) {
  //Search through Dynamo DB for user
  //If user found, return the user
  //If user not found, return undefined
  const params = {
    TableName: process.env.AWS_DYNAMO_TABLE,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "email",
    },
    ExpressionAttributeValues: {
      ":pk": email,
    },
  };
  try {
    const result = await dynamodb.query(params).promise();
    console.log("USER LOOKUP RESULT BELOW");
    console.log(result);
    const user = result.Items[0] as SavedUser | undefined;
    if (user === undefined) {
      return undefined;
    }
    var userData = JSON.parse(user.details);
    if (user.password) {
      userData.hasPassword = true;
    } else {
      userData.hasPassword = false;
    }
    //userData contains all the user information //username, plants, hashed password if exists
    const formattedUser: UserModel = {
      ...userData,
      email: user.email,
      password: user.password,
    };
    return formattedUser;
  } catch (error) {
    console.log("ERROR WHEN FINDING USER");
    console.log(error);
    return error;
  }
}

export async function createUser(
  email: string,
  details: string,
  password: string
) {
  const params = {
    TableName: process.env.AWS_DYNAMO_TABLE,
    Item: {
      email,
      details,
      password,
    },
  };
  console.log(params);
  try {
    const user = await dynamodb.put(params).promise();
    console.log("User created successfully");
    console.log(user);
    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

export async function updateUser(email: string, newDetails: string) {
  try{
  const params = {
    TableName: process.env.AWS_DYNAMO_TABLE,
    Key: {email},
    UpdateExpression: "SET #details = :newDetails",
    ExpressionAttributeNames: {
      "#details": "details"
    },
    ExpressionAttributeValues: {
      ":newDetails": newDetails
    }
  }
  console.log(params)
    const updated = await dynamodb.update(params).promise();
    console.log("Updated User");
    console.log(updated);
  } catch (error) {
    console.log("error updating user");
    console.log(error);
  }
}

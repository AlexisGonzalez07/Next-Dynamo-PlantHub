import AWS from "aws-sdk";
// Configure the AWS SDK with your credentials and desired region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_DYNAMO,
});

// Create an instance of the DynamoDB DocumentClient
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getUser(email: string) {
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

export async function createUser(email: string, firstName: string, lastName: string, username?: string, password?: string){
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
    try {
      await dynamodb.put(params).promise();
      console.log('User created successfully');
      return true
    } catch (error) {
      console.error('Error creating user:', error);
      return false
    }
  }
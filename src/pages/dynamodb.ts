import AWS from "aws-sdk";
// Configure the AWS SDK with your credentials and desired region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_DYNAMO,
});

// Create an instance of the DynamoDB DocumentClient
export const dynamodb = new AWS.DynamoDB.DocumentClient();

import * as AWS from "aws-sdk";
import {PromiseResult} from "aws-sdk/lib/request";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

let kms = new AWS.KMS();
let promises: Promise<any>[] = [];

let UserActivitiesTableNameEncrypted: string = process.env['user_activities_table'];
let UserActivitiesTableNameDecrypted: string;
promises.push(kms.decrypt({CiphertextBlob: Buffer.from(UserActivitiesTableNameEncrypted, 'base64')} as (AWS.KMS.Types.DecryptRequest), (err: AWS.AWSError, data: AWS.KMS.Types.DecryptResponse): void => {
    if (err) {
        console.error('Decrypt error:', err);
    }
    UserActivitiesTableNameDecrypted = data.Plaintext.toString();
}).promise());

let InvitationTableNameEncrypted: string = process.env['invitation_table'];
let InvitationTableNameDecrypted: string;
promises.push(kms.decrypt({CiphertextBlob: Buffer.from(InvitationTableNameEncrypted, 'base64')} as (AWS.KMS.Types.DecryptRequest), (err: AWS.AWSError, data: AWS.KMS.Types.DecryptResponse): void => {
    if (err) {
        console.error('Decrypt error:', err);
    }
    InvitationTableNameDecrypted = data.Plaintext.toString();
}).promise());

let DynamoDBRegionEncrypted: string = process.env['dynamodb_region'];
let DynamoDBRegionDecrypted: string;
promises.push(kms.decrypt({CiphertextBlob: Buffer.from(DynamoDBRegionEncrypted, 'base64')} as (AWS.KMS.Types.DecryptRequest), (err: AWS.AWSError, data: AWS.KMS.Types.DecryptResponse): void => {
    if (err) {
        console.error('Decrypt error:', err);
    }
    DynamoDBRegionDecrypted = data.Plaintext.toString();
}).promise());

let CognitoUserPoolIdEncrypted: string = process.env['user_pool_id'];
let CognitoUserPoolIdDecrypted: string;
promises.push(kms.decrypt({CiphertextBlob: Buffer.from(CognitoUserPoolIdEncrypted, 'base64')} as (AWS.KMS.Types.DecryptRequest), (err: AWS.AWSError, data: AWS.KMS.Types.DecryptResponse): void => {
    if (err) {
        console.error('Decrypt error:', err);
    }
    CognitoUserPoolIdDecrypted = data.Plaintext.toString();
}).promise());

let CognitoRegionEncrypted: string = process.env['cognito_region'];
let CognitoRegionDecrypted: string;
promises.push(kms.decrypt({CiphertextBlob: Buffer.from(CognitoRegionEncrypted, 'base64')} as (AWS.KMS.Types.DecryptRequest), (err: AWS.AWSError, data: AWS.KMS.Types.DecryptResponse): void => {
    if (err) {
        console.error('Decrypt error:', err);
    }
    CognitoRegionDecrypted = data.Plaintext.toString();
}).promise());

let EmailSenderEncrypted: string = process.env['email_sender'];
let EmailSenderDecrypted: string;
promises.push(kms.decrypt({CiphertextBlob: Buffer.from(EmailSenderEncrypted, 'base64')} as (AWS.KMS.Types.DecryptRequest), (err: AWS.AWSError, data: AWS.KMS.Types.DecryptResponse): void => {
    if (err) {
        console.error('Decrypt error:', err);
    }
    EmailSenderDecrypted = data.Plaintext.toString();
}).promise());

let SESRegionEncrypted: string = process.env['ses_region'];
let SESRegionDecrypted: string;
promises.push(kms.decrypt({CiphertextBlob: Buffer.from(SESRegionEncrypted, 'base64')} as (AWS.KMS.Types.DecryptRequest), (err: AWS.AWSError, data: AWS.KMS.Types.DecryptResponse): void => {
    if (err) {
        console.error('Decrypt error:', err);
    }
    SESRegionDecrypted = data.Plaintext.toString();
}).promise());

let dynamodb: AWS.DynamoDB.DocumentClient;
let cognitoidp: AWS.CognitoIdentityServiceProvider;
let ses: AWS.SESV2;

let initial = () => {
    return Promise.all(promises).then(() => {
        dynamodb = new AWS.DynamoDB.DocumentClient({
            region: DynamoDBRegionDecrypted,
        });

        cognitoidp = new AWS.CognitoIdentityServiceProvider({
            region: CognitoRegionDecrypted,
        });

        ses = new AWS.SESV2({
            region: SESRegionDecrypted,
        });
    });
};

exports.get_latence = async (event) => {
    return +new Date() - event
};

exports.get_timestamp = async () => {
    return new Date().toISOString()
};

exports.heart_beats = async (event) => {
    await initial();

    let heart_beat = event;
    heart_beat["expire_time"] = Math.round(+new Date() / 1000) + 10;

    if (dynamodb) {
        await dynamodb.update({
            TableName: UserActivitiesTableNameDecrypted,
            Key: {
                'user-sub': heart_beat["user"]
            },
            UpdateExpression: 'set activities = :activities, gamelift_region = :region, #expire_time = :expire_time',
            ExpressionAttributeValues: {
                ":activities": heart_beat["activities"],
                ':region': heart_beat['region'],
                ':expire_time': heart_beat['expire_time'],
            },
            ExpressionAttributeNames: {
                "#expire_time": "expire-time"
            }
        } as AWS.DynamoDB.Types.UpdateItemInput, (err: AWS.AWSError) => {
            if (err) {
                console.error("Unable to update item in " + UserActivitiesTableNameDecrypted + ": \n");
                console.error(err.message + "\n");
            }
        }).promise();
    } else {
        console.error("dynamo db didn't init\n");
    }
};

exports.invite_friend = async (event) => {
    await initial();

    let invitation = event;
    invitation["expire_time"] = Math.round(+new Date() / 1000) + 10;

    if (dynamodb) {
        await dynamodb.put({
            TableName: InvitationTableNameDecrypted,
            Item: {
                'from-user-sub': invitation['from'],
                'to-user-sub': invitation['to'],
                'gamelift_region': invitation['region'],
                'game_session': invitation['game_session'],
                'expire-time': invitation['expire_time'],
            },
        } as AWS.DynamoDB.Types.PutItemInput, (err: AWS.AWSError) => {
            if (err) {
                console.error("Unable to put item in " + InvitationTableNameDecrypted + ": \n");
                console.error(err.message + "\n");
            }
        }).promise();
    } else {
        console.error("dynamo db didn't init\n");
    }

    let result: PromiseResult<AWS.DynamoDB.GetItemOutput, AWS.AWSError>;
    if (dynamodb) {
        result = (await dynamodb.get({
            TableName: UserActivitiesTableNameDecrypted,
            Key: {
                'user-sub': invitation['to']
            },
        } as AWS.DynamoDB.Types.GetItemInput, (err: AWS.AWSError) => {
            if (err) {
                console.error("Unable to get item in " + UserActivitiesTableNameDecrypted + ": \n");
                console.error(err.message + "\n");
            }
        }).promise());
    } else {
        console.error("dynamo db didn't init\n");
    }

    if (result.Item == null) {
        let result1: PromiseResult<AWS.CognitoIdentityServiceProvider.ListUsersResponse, AWS.AWSError>;
        if (cognitoidp) {
            result1 = (await cognitoidp.listUsers({
                UserPoolId: CognitoUserPoolIdDecrypted,
                Filter: 'sub="' + invitation['to'] + '"'
            } as AWS.CognitoIdentityServiceProvider.ListUsersRequest, (err: AWS.AWSError) => {
                if (err) {
                    console.error("Unable to list users.\n");
                    console.error(err.message + "\n");
                }
            }).promise())
        } else {
            console.error("cognito idp didn't init\n");
        }

        if (result1 && result1.Users.length > 0) {
            if (ses) {
                ses.sendEmail({
                        Destination: {
                            ToAddresses: [
                                result1.Users[0].Attributes.find((value) => {
                                    return value.Name == "email"
                                }).Value,
                            ]
                        },
                        Content: {
                            Simple: {
                                Body: {
                                    Html: {
                                        Charset: 'UTF-8',
                                        Data:
                                            '<h1>Amazon SES test (AWS SDK for Nodejs)</h1>' +
                                            '<p>This email was sent with <a href="https://aws.amazon.com/ses/">' +
                                            'Amazon SES</a> using the <a href="https://aws.amazon.com/sdk-for-ruby/">' +
                                            'AWS SDK for Nodejs</a>. add your app launch url here.</p>',
                                    },
                                    Text: {
                                        Charset: 'UTF-8',
                                        Data: 'This email was sent with Amazon SES using the AWS SDK for Nodejs.',
                                    },
                                },
                                Subject: {
                                    Charset: 'UTF-8',
                                    Data: 'Amazon SES test (AWS SDK for Ruby)',
                                },
                            },
                        },
                        FromEmailAddress: EmailSenderDecrypted,
                        ConfigurationSetName: "",
                    } as AWS.SESV2.SendEmailRequest, (err: AWS.AWSError) => {
                        if (err) {
                            console.error("Email not sent. Error message: \n");
                            console.error(err.message + "\n");
                        }
                    }
                )
                ;
            } else {
                console.error("ses didn't init\n");
            }
        }
    }
};

exports.get_invitation = async (event) => {
    await initial();

    let invitation = event;
    invitation["expire_time"] = Math.round(+new Date() / 1000);

    let result: PromiseResult<AWS.DynamoDB.QueryOutput, AWS.AWSError>;
    if (dynamodb) {
        result = (await dynamodb.query({
            TableName: InvitationTableNameDecrypted,
            KeyConditionExpression: "#to_user_sub = :to_user_sub and #expire_time >= :expire_time",
            ExpressionAttributeNames: {
                "#to_user_sub": "to-user-sub",
                "#expire_time": "expire-time",
            },
            ExpressionAttributeValues: {
                ":to_user_sub": invitation["to"],
                ':expire_time': invitation['expire_time'],
            },
        } as AWS.DynamoDB.DocumentClient.QueryInput, (err: AWS.AWSError) => {
            if (err) {
                console.error("Unable to query item in " + InvitationTableNameDecrypted + ": \n");
                console.error(err.message + "\n");
            }
        }).promise());
    } else {
        console.error("dynamo db didn't init\n");
    }

    if (result && result.Items.length > 0) {
        let invite = result.Items.sort((a, b): number => {
            return +b["expire-time"].N - +a["expire-time"].N;
        })[0];

        if (dynamodb) {
            dynamodb.delete({
                TableName: InvitationTableNameDecrypted,
                Key: {
                    'to-user-sub': invitation["to"],
                    "expire-time": invite['expire-time'],
                },
            } as AWS.DynamoDB.DocumentClient.DeleteItemInput, (err: AWS.AWSError) => {
                if (err) {
                    console.error("Unable to delete item in " + InvitationTableNameDecrypted + ": \n");
                    console.error(err.message + "\n");
                }
            });
        } else {
            console.error("dynamo db didn't init\n");
        }

        return {
            'region': invite['gamelift_region'],
            'game_session': invite['game_session'],
            'from': invite['from-user-sub'],
        };
    } else {
        return {};
    }
};
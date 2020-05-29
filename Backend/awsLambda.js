"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var AWS = require("aws-sdk");
var kms = new AWS.KMS();
var promises = [];
var UserActivitiesTableNameEncrypted = process.env['user_activities_table'];
var UserActivitiesTableNameDecrypted;
promises.push(kms.decrypt({ CiphertextBlob: Buffer.from(UserActivitiesTableNameEncrypted, 'base64') }, function (err, data) {
    if (err) {
        console.error('Decrypt error:', err);
    }
    UserActivitiesTableNameDecrypted = data.Plaintext.toString();
}).promise());
var InvitationTableNameEncrypted = process.env['invitation_table'];
var InvitationTableNameDecrypted;
promises.push(kms.decrypt({ CiphertextBlob: Buffer.from(InvitationTableNameEncrypted, 'base64') }, function (err, data) {
    if (err) {
        console.error('Decrypt error:', err);
    }
    InvitationTableNameDecrypted = data.Plaintext.toString();
}).promise());
var DynamoDBRegionEncrypted = process.env['dynamodb_region'];
var DynamoDBRegionDecrypted;
promises.push(kms.decrypt({ CiphertextBlob: Buffer.from(DynamoDBRegionEncrypted, 'base64') }, function (err, data) {
    if (err) {
        console.error('Decrypt error:', err);
    }
    DynamoDBRegionDecrypted = data.Plaintext.toString();
}).promise());
var CognitoUserPoolIdEncrypted = process.env['user_pool_id'];
var CognitoUserPoolIdDecrypted;
promises.push(kms.decrypt({ CiphertextBlob: Buffer.from(CognitoUserPoolIdEncrypted, 'base64') }, function (err, data) {
    if (err) {
        console.error('Decrypt error:', err);
    }
    CognitoUserPoolIdDecrypted = data.Plaintext.toString();
}).promise());
var CognitoRegionEncrypted = process.env['cognito_region'];
var CognitoRegionDecrypted;
promises.push(kms.decrypt({ CiphertextBlob: Buffer.from(CognitoRegionEncrypted, 'base64') }, function (err, data) {
    if (err) {
        console.error('Decrypt error:', err);
    }
    CognitoRegionDecrypted = data.Plaintext.toString();
}).promise());
var EmailSenderEncrypted = process.env['email_sender'];
var EmailSenderDecrypted;
promises.push(kms.decrypt({ CiphertextBlob: Buffer.from(EmailSenderEncrypted, 'base64') }, function (err, data) {
    if (err) {
        console.error('Decrypt error:', err);
    }
    EmailSenderDecrypted = data.Plaintext.toString();
}).promise());
var SESRegionEncrypted = process.env['ses_region'];
var SESRegionDecrypted;
promises.push(kms.decrypt({ CiphertextBlob: Buffer.from(SESRegionEncrypted, 'base64') }, function (err, data) {
    if (err) {
        console.error('Decrypt error:', err);
    }
    SESRegionDecrypted = data.Plaintext.toString();
}).promise());
var dynamodb;
var cognitoidp;
var ses;
var initial = function () {
    return Promise.all(promises).then(function () {
        dynamodb = new AWS.DynamoDB.DocumentClient({
            region: DynamoDBRegionDecrypted
        });
        cognitoidp = new AWS.CognitoIdentityServiceProvider({
            region: CognitoRegionDecrypted
        });
        ses = new AWS.SESV2({
            region: SESRegionDecrypted
        });
    });
};
exports.get_latence = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, +new Date() - event];
    });
}); };
exports.get_timestamp = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Date().toISOString()];
    });
}); };
exports.heart_beats = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var heart_beat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initial()];
            case 1:
                _a.sent();
                heart_beat = event;
                heart_beat["expire_time"] = Math.round(+new Date() / 1000) + 10;
                if (!dynamodb) return [3 /*break*/, 3];
                return [4 /*yield*/, dynamodb.update({
                        TableName: UserActivitiesTableNameDecrypted,
                        Key: {
                            'user-sub': heart_beat["user"]
                        },
                        UpdateExpression: 'set activities = :activities, gamelift_region = :region, #expire_time = :expire_time',
                        ExpressionAttributeValues: {
                            ":activities": heart_beat["activities"],
                            ':region': heart_beat['region'],
                            ':expire_time': heart_beat['expire_time']
                        },
                        ExpressionAttributeNames: {
                            "#expire_time": "expire-time"
                        }
                    }, function (err) {
                        if (err) {
                            console.error("Unable to update item in " + UserActivitiesTableNameDecrypted + ": \n");
                            console.error(err.message + "\n");
                        }
                    }).promise()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                console.error("dynamo db didn't init\n");
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.invite_friend = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var invitation, result, result1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initial()];
            case 1:
                _a.sent();
                invitation = event;
                invitation["expire_time"] = Math.round(+new Date() / 1000) + 10;
                if (!dynamodb) return [3 /*break*/, 3];
                return [4 /*yield*/, dynamodb.put({
                        TableName: InvitationTableNameDecrypted,
                        Item: {
                            'from-user-sub': invitation['from'],
                            'to-user-sub': invitation['to'],
                            'gamelift_region': invitation['region'],
                            'game_session': invitation['game_session'],
                            'expire-time': invitation['expire_time']
                        }
                    }, function (err) {
                        if (err) {
                            console.error("Unable to put item in " + InvitationTableNameDecrypted + ": \n");
                            console.error(err.message + "\n");
                        }
                    }).promise()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                console.error("dynamo db didn't init\n");
                _a.label = 4;
            case 4:
                if (!dynamodb) return [3 /*break*/, 6];
                return [4 /*yield*/, dynamodb.get({
                        TableName: UserActivitiesTableNameDecrypted,
                        Key: {
                            'user-sub': invitation['to']
                        }
                    }, function (err) {
                        if (err) {
                            console.error("Unable to get item in " + UserActivitiesTableNameDecrypted + ": \n");
                            console.error(err.message + "\n");
                        }
                    }).promise()];
            case 5:
                result = (_a.sent());
                return [3 /*break*/, 7];
            case 6:
                console.error("dynamo db didn't init\n");
                _a.label = 7;
            case 7:
                if (!(result.Item == null)) return [3 /*break*/, 11];
                result1 = void 0;
                if (!cognitoidp) return [3 /*break*/, 9];
                return [4 /*yield*/, cognitoidp.listUsers({
                        UserPoolId: CognitoUserPoolIdDecrypted,
                        Filter: 'sub="' + invitation['to'] + '"'
                    }, function (err) {
                        if (err) {
                            console.error("Unable to list users.\n");
                            console.error(err.message + "\n");
                        }
                    }).promise()];
            case 8:
                result1 = (_a.sent());
                return [3 /*break*/, 10];
            case 9:
                console.error("cognito idp didn't init\n");
                _a.label = 10;
            case 10:
                if (result1 && result1.Users.length > 0) {
                    if (ses) {
                        ses.sendEmail({
                            Destination: {
                                ToAddresses: [
                                    result1.Users[0].Attributes.find(function (value) {
                                        return value.Name == "email";
                                    }).Value,
                                ]
                            },
                            Content: {
                                Simple: {
                                    Body: {
                                        Html: {
                                            Charset: 'UTF-8',
                                            Data: '<h1>Amazon SES test (AWS SDK for Nodejs)</h1>' +
                                                '<p>This email was sent with <a href="https://aws.amazon.com/ses/">' +
                                                'Amazon SES</a> using the <a href="https://aws.amazon.com/sdk-for-ruby/">' +
                                                'AWS SDK for Nodejs</a>. add your app launch url here.</p>'
                                        },
                                        Text: {
                                            Charset: 'UTF-8',
                                            Data: 'This email was sent with Amazon SES using the AWS SDK for Nodejs.'
                                        }
                                    },
                                    Subject: {
                                        Charset: 'UTF-8',
                                        Data: 'Amazon SES test (AWS SDK for Ruby)'
                                    }
                                }
                            },
                            FromEmailAddress: EmailSenderDecrypted,
                            ConfigurationSetName: ""
                        }, function (err) {
                            if (err) {
                                console.error("Email not sent. Error message: \n");
                                console.error(err.message + "\n");
                            }
                        });
                    }
                    else {
                        console.error("ses didn't init\n");
                    }
                }
                _a.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.get_invitation = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var invitation, result, invite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initial()];
            case 1:
                _a.sent();
                invitation = event;
                invitation["expire_time"] = Math.round(+new Date() / 1000);
                if (!dynamodb) return [3 /*break*/, 3];
                return [4 /*yield*/, dynamodb.query({
                        TableName: InvitationTableNameDecrypted,
                        KeyConditionExpression: "#to_user_sub = :to_user_sub and #expire_time >= :expire_time",
                        ExpressionAttributeNames: {
                            "#to_user_sub": "to-user-sub",
                            "#expire_time": "expire-time"
                        },
                        ExpressionAttributeValues: {
                            ":to_user_sub": invitation["to"],
                            ':expire_time': invitation['expire_time']
                        }
                    }, function (err) {
                        if (err) {
                            console.error("Unable to query item in " + InvitationTableNameDecrypted + ": \n");
                            console.error(err.message + "\n");
                        }
                    }).promise()];
            case 2:
                result = (_a.sent());
                return [3 /*break*/, 4];
            case 3:
                console.error("dynamo db didn't init\n");
                _a.label = 4;
            case 4:
                if (result && result.Items.length > 0) {
                    invite = result.Items.sort(function (a, b) {
                        return +b["expire-time"].N - +a["expire-time"].N;
                    })[0];
                    if (dynamodb) {
                        dynamodb["delete"]({
                            TableName: InvitationTableNameDecrypted,
                            Key: {
                                'to-user-sub': invitation["to"],
                                "expire-time": invite['expire-time']
                            }
                        }, function (err) {
                            if (err) {
                                console.error("Unable to delete item in " + InvitationTableNameDecrypted + ": \n");
                                console.error(err.message + "\n");
                            }
                        });
                    }
                    else {
                        console.error("dynamo db didn't init\n");
                    }
                    return [2 /*return*/, {
                            'region': invite['gamelift_region'],
                            'game_session': invite['game_session'],
                            'from': invite['from-user-sub']
                        }];
                }
                else {
                    return [2 /*return*/, {}];
                }
                return [2 /*return*/];
        }
    });
}); };

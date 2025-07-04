#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Cloudfront5xxAlarmsStack } from "../lib/cloudfront-5xx-alarms-stack";
import {
    CloudFrontClient,
    ListDistributionsCommand,
} from "@aws-sdk/client-cloudfront";
import { ConfigProps } from "../shared/types";

const config = require("../config/config.json") as ConfigProps;

async function createAlarmsForDistributions() {
    try {
        // Initialize CloudFront client with default region from CDK context
        const client = new CloudFrontClient({ 
            region: process.env.CDK_DEFAULT_REGION || "us-east-1"
        });

        // Fetch all distributions from the current AWS account
        const command = new ListDistributionsCommand({});
        const response = await client.send(command);
        const distributions = response.DistributionList?.Items;

        if (!distributions || distributions.length === 0) {
            console.log("No CloudFront distributions found in the current account");
            return;
        }

        const app = new cdk.App();

        // Generate monitoring stacks for each CloudFront distribution
        for (const distribution of distributions) {
            new Cloudfront5xxAlarmsStack(
                app,
                `Cloudfront5xxAlarmsStack-${distribution.Id}`,
                {
                    distribution,
                    snsTopicArn: config.snsTopicArn,
                    alarmSettings: config.alarmSettings,
                    env: {
                        account: process.env.CDK_DEFAULT_ACCOUNT,
                        region: process.env.CDK_DEFAULT_REGION || "us-east-1",
                    },
                }
            );
        }
    } catch (error) {
        console.error("Failed to create CloudFront alarm stacks:", error);
        process.exit(1);
    }
}

// Bootstrap the CDK application
createAlarmsForDistributions();

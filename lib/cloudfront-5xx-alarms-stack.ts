import * as cdk from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cloudwatch_actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import { DistributionSummary } from "@aws-sdk/client-cloudfront";
import { AlarmSettings } from "../shared/types";

export class Cloudfront5xxAlarmsStack extends cdk.Stack {
    constructor(
        scope: Construct,
        id: string,
        props: cdk.StackProps & {
            distribution: DistributionSummary;
            snsTopicArn: string;
            alarmSettings: AlarmSettings;
        }
    ) {
        super(scope, id, props);

        // Import existing SNS topic for alarm notifications
        const topic = sns.Topic.fromTopicArn(
            this,
            "SnsTopic",
            props.snsTopicArn
        );

        // CloudWatch alarm for monitoring CloudFront 5XX error threshold
        const alarm = new cloudwatch.Alarm(this, "5XXErrorAlarm", {
            metric: new cloudwatch.Metric({
                namespace: "AWS/CloudFront",
                metricName: "5xxErrorRate",
                dimensionsMap: {
                    DistributionId: props.distribution.Id!,
                },
                statistic: "Average",
                period: cdk.Duration.minutes(props.alarmSettings.periodMinutes),
            }),
            threshold: props.alarmSettings.threshold,
            evaluationPeriods: props.alarmSettings.evaluationPeriods,
            datapointsToAlarm: props.alarmSettings.datapointsToAlarm,
            alarmDescription: `5xxErrorRate alarm for CloudFront distribution ${props.distribution.Id}`,
            actionsEnabled: true,
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        });

        // Configure alarm to notify SNS topic
        alarm.addAlarmAction(new cloudwatch_actions.SnsAction(topic));
    }
}

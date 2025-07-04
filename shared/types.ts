import { DistributionSummary } from "@aws-sdk/client-cloudfront";

export interface AlarmSettings {
    threshold: number;
    periodMinutes: number;
    evaluationPeriods: number;
    datapointsToAlarm: number;
}

export interface ConfigProps {
    snsTopicArn: string;
    alarmSettings: AlarmSettings;
}

export interface StackProps {
    distribution: DistributionSummary;
    snsTopicArn: string;
    alarmSettings: AlarmSettings;
}

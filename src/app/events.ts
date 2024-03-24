export interface EventProposal {
    id?: number;
    name: string;
    description: string;
    organization: string;
    tags: string[];
    duration: number;
    times: PotentialTimeslot[];
    password: string;
}

export interface PotentialTimeslot {
    startTime: Date;
    endTime: Date;
}

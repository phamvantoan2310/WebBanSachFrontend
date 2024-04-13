class MeetingModel {
    meeting_id: number;
    meeting_content: string;
    meeting_schecule: Date;
    meeting_hour: Date;
    location: string;

    constructor(meeting_id: number, meeting_content: string, meeting_schecule: Date, meeting_hour: Date, location: string){
        this.meeting_id = meeting_id;
        this.meeting_content = meeting_content;
        this.meeting_schecule = meeting_schecule;
        this.meeting_hour = meeting_hour;
        this.location = location;
    }
}

export default MeetingModel;
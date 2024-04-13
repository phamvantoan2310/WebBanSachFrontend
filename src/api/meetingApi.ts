import React from "react";
import MeetingModel from "../models/MeetingModel";

export async function getAllMeeting(token : string) {
    const endpoint = "http://localhost:8080/meetings";
    const meetings : MeetingModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });

        if(!response.ok){
            throw new Error("fail call api getAllMeeting");
        }

        const responseData = await response.json();
        const data = responseData._embedded.meetings;

        for(const dataMeeting of data){
            meetings.push({
                meeting_id : dataMeeting.meetingID,
                meeting_content : dataMeeting.meetingContent,
                meeting_schecule : dataMeeting.meetingSchedule,
                meeting_hour : dataMeeting.meetingHour,
                location: dataMeeting.location
            })
        }

        return meetings;
    } catch (error) {
        console.log(error);
    }
}


export async function getMeetingByUserID(token : string, userID: number) {
    const endpoint = `http://localhost:8080/meetings/search/findByUserList_UserID?userId=${userID}&sort=meetingID`;
    const meetings : MeetingModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });

        if(!response.ok){
            throw new Error("fail call api getMeetingByUserID");
        }

        const responseData = await response.json();
        const data = responseData._embedded.meetings;

        for(const dataMeeting of data){
            meetings.push({
                meeting_id : dataMeeting.meetingID,
                meeting_content : dataMeeting.meetingContent,
                meeting_schecule : dataMeeting.meetingSchedule,
                meeting_hour : dataMeeting.meetingHour,
                location : dataMeeting.location
            })
        }

        return meetings;
    } catch (error) {
        console.log(error);
    }
}
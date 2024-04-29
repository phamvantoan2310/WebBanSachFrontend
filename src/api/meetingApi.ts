import React from "react";
import MeetingModel from "../models/MeetingModel";
import UserModel from "../models/UserModel";
import { Ethernet } from "react-bootstrap-icons";
import { JsxEmit } from "typescript";

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


export async function createMeeting(token: string, meetingContent: string, meetingDate: string, meetingTime: string, meetingLocation: string, staffIDs: number[]) {
    const meeting = {
        meetingID: 0,
        meetingContent: meetingContent,
        meetingSchedule: meetingDate,
        meetingHour: meetingTime+":00",
        location: meetingLocation
    }
    const meetingData = {
        meeting : meeting,
        staffIDs : staffIDs
    }
    const endpoint = "http://localhost:8080/admin/createmeeting";
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify(meetingData)
        });

        if(!response.ok){
            throw new Error("fail call api createMeeting");
        }

        return response;
    } catch (error) {
        console.log(error);
    }
}


export async function cancelTheMeeting(token:string, meetingID: number) {
    const endpoint = "http://localhost:8080/admin/cancelmeeting";
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }, 
            body: JSON.stringify(meetingID)
        });

        if(!response.ok){
            throw new Error("fail call api cancelTheMeeting");
        }

        return response;
    } catch (error) {
        console.log(error);
    }
}
import ReportModel from "../models/ReportModel";
import ReportTypeModel from "../models/ReportTypeModel";
import GetBase64 from "../util/getBase64";

export async function getAllReportType(token: string) {
    const reportTypes: ReportTypeModel[] = [];
    const endpoint = "http://localhost:8080/reporttypes";
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api getAllReportType");
        }
        const responseData = await response.json();
        const data = responseData._embedded.reportTypes;

        for (const key in data) {
            reportTypes.push({
                reportTypeID: data[key].reportTypeID,
                reportTypeName: data[key].reportTypeName
            });
        }

        return reportTypes;
    } catch (error) {
        console.log(error);
    }
}

export async function createReport(token: string, reportDetail: string, reportTypeID: number, orderID: number, reportImage: File | null) {
    const endpoint = "http://localhost:8080/user/createreport";
    let reportImageData = null;
    try {
        reportImageData = reportImage ? await GetBase64(reportImage) : "";
    } catch (error) {
        console.log(error);
        reportImageData = "";
    }
    const reportResponse = {
        reportDetail: reportDetail,
        reportImageDetail: reportImageData,
        reportTypeID: reportTypeID,
        orderID: orderID
    };
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reportResponse)
        });
        if (!response.ok) {
            throw new Error("fail call api createReport");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllReport(token: string) {
    const endpoint = "http://localhost:8080/reports";
    const reports: ReportModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api getAllReport");
        }
        const responseData = await response.json();
        const data = responseData._embedded.reports;

        for (const key of data) {
            reports.push({
                reportID: key.reportID,
                reportDetail: key.reportDetail,
                reportImage: key.reportImage,
                reportResponse: key.reportResponse,
                createReportDate: key.createReportDate
            });
        }
        return reports;
    } catch (error) {
        console.log(error);
    }
}

export async function getReportbyID(token: string, reportID: number) {
    const endpoint = `http://localhost:8080/reports/${reportID}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api getReportByID");
        }
        const responseData = await response.json();
        return ({
            reportID: responseData.reportID,
            reportDetail: responseData.reportDetail,
            reportImage: responseData.reportImage,
            reportResponse: responseData.reportResponse,
            createReportDate: responseData.createReportDate
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getReportTypebyReportID(token: string, reportID: number) {
    const endpoint = `http://localhost:8080/reports/${reportID}/reporttype`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api getReportTypeByReportID");
        }
        const responseData = await response.json();
        if (responseData) {
            return ({
                reportTypeID: responseData.reportTypeID,
                reportTypeName: responseData.reportTypeName
            });
        } else {
            throw new Error("report type undefined");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function sendResponse(token:string, responseReport: string, reportID: number) {
    const endpoint = "http://localhost:8080/staff/sendreportresponse";
    try {
        const responseSendData = {
            reportID: reportID,
            responseReport : responseReport
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify(responseSendData)
        });
        if(!response.ok){
            throw new Error("fail call api sendResponse");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}
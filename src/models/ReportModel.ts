class ReportModel{
    reportID: number;
    reportDetail: string;
    reportImage : string;
    reportResponse: string;
    createReportDate : string;
    constructor(reportID: number, reportDetail: string, reportImage: string, reportResponse: string, createReportDate: string){
        this.reportID = reportID;
        this.reportDetail = reportDetail;
        this.reportImage = reportImage;
        this.reportResponse = reportResponse;
        this.createReportDate = createReportDate;
    }
}

export default ReportModel;
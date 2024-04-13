class ReportTypeModel{
    reportTypeID: number;
    reportTypeName: string;

    constructor(reportTypeID: number, reportTypeName: string){
        this.reportTypeID = reportTypeID;
        this.reportTypeName = reportTypeName;
    }
}

export default ReportTypeModel;
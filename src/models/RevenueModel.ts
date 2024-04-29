class RevenueModel {
    revenueID: number;
    totalRevenue: number;
    revenueDate: string;

    constructor(revenueID: number, totalRevenue: number, revenueDate: string){
        this.revenueID = revenueID;
        this.totalRevenue = totalRevenue;
        this.revenueDate = revenueDate;
    }
}

export default RevenueModel;
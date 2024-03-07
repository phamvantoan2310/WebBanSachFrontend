class EvaluateModel{
    evaluate_id: number;
    decription?: string;
    point?: number;

    constructor(evaluate_id: number, decription?: string, point?: number){
        this.evaluate_id = evaluate_id;
        this.decription =decription;
        this.point = point;
    }
}

export default EvaluateModel;
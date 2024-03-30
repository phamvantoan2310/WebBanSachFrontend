class CategoryModel {
    categoryID: number;
    categoryName: string;

    constructor(categoryID: number, categoryName: string){
        this.categoryID = categoryID;
        this.categoryName = categoryName;
    }
}

export default CategoryModel;
import IModel from '../../common/IModel.interface';

class CategoryModel implements IModel{
    categoryId: number;
    name: string;
    imagePath: string;
}

export default CategoryModel;
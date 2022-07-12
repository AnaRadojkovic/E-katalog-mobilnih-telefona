import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class Price implements IModel {
    priceId: number;
    price: number;
    createdAt: Date;
}

class Photo implements IModel {
   photoId: number;
   imagePath: string;
}

class ArticleModel implements IModel {
    articleId: number;
    name: string;
    description: string;
    os: string;
    ramMemory: string;
    internalMemory: string;
    resolution: string;
    displaySize: string;
    selfieCamera: string;
    mainCamera: string;
    procesor: string;
    bluetooth: string;
    wifi: string;
    network: string;
    createdAt: Date;
    categoryId: number;
    category?: CategoryModel;
    price: number;
    photos: Photo[] = [];
}

export default ArticleModel;

export { Price as ArticlePrice };
export { Photo as ArticlePhoto };



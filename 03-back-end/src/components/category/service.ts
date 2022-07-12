import CategoryModel from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddCategory } from './dto/AddCategory';
import BaseService from '../../common/BaseService';
import { IEditCategory } from './dto/EditCategory';

class CategoryModelAdapterOptions implements IModelAdapterOptions {
}

class CategoryService extends BaseService<CategoryModel>{

    protected async adaptModel(
        row: any,
    ): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;
        item.imagePath = row?.image_path;
        return item;

    }

    public async getAll(
    ): Promise<CategoryModel[]|IErrorResponse> {
        return await this.getAllFromTable<CategoryModelAdapterOptions>(
            'category',
            null,
        );
    }

    public async getById(
        categoryId: number,
        options: Partial<CategoryModelAdapterOptions> = { },
        ): Promise<CategoryModel|null|IErrorResponse>{
       return await this.getByIdFromTable<CategoryModelAdapterOptions>(
           "category",
            categoryId,
            options,
            );
    }

    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
                INSERT
                    category
                SET
                    name = ?,
                    image_path = ?;`;

            this.db.execute(sql, [ data.name, data.imagePath ])
                .then(async result => {
                    const insertInfo: any = result[0];

                    const newCategoryId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newCategoryId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }
    public async edit(
        categoryId: number,
        data: IEditCategory,
        options: Partial<CategoryModelAdapterOptions> = { },
        ): Promise<CategoryModel|IErrorResponse> {
        const result = await this.getById(categoryId);

        if(result === null){
            return null;
        }
        if(!(result instanceof CategoryModel)){
            return result;
        }
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
                UPDATE
                    category
                SET
                    name = ?,
                    image_path = ?
                WHERE
                    category_id = ?;`;
            this.db.execute(sql, [data.name, data.imagePath, categoryId])
                .then(async result => {
                    resolve(await this.getById(categoryId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }
    public async delete(categoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM category WHERE category_id = ?;";
            this.db.execute(sql, [categoryId])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +[deleteInfo?.affectedRows];

                    if(deletedRowCount === 1){
                        resolve({
                            errorCode: 0,
                            errorMessage: "One record deleted. "
                        }); 
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record could not be deleted because it does not exist."
                        });
                    }
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                        
                    });
                })
        });
    }
}

export default CategoryService;
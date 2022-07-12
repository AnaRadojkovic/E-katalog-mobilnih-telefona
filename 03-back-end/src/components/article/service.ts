import BaseService from "../../common/BaseService";
import IModelAdapterOptionsInterface from "../../common/IModelAdapterOptions.interface";
import ArticleModel, { ArticlePhoto, ArticlePrice } from "./model";
import { IAddArticle, IUploadedPhoto } from "./dto/IAddArticle";
import CategoryModel from "../category/model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IEditArticle } from "./dto/IEditArticle";
import * as fs from "fs";
import Config from "../../config/dev";
import path = require("path");

class ArticleModelAdapterOptions implements IModelAdapterOptionsInterface {
  loadCategory: boolean = false;
  loadPrices: boolean = false;
  loadPhotos: boolean = false;
}

class ArticleService extends BaseService<ArticleModel> {
  protected async adaptModel(
    data: any,
    options: Partial<ArticleModelAdapterOptions>
  ): Promise<ArticleModel> {
    const item: ArticleModel = new ArticleModel();

    item.articleId = +data?.article_id;
    item.categoryId = +data?.category_id;
    item.name = data?.name;
    item.description = data?.description;
    item.os = data?.os;
    item.ramMemory = data?.ramMemory;
    item.internalMemory = data?.internalMemory;
    item.resolution = data?.resolution;
    item.displaySize = data?.displaySize;
    item.selfieCamera = data?.selfieCamera;
    item.mainCamera = data?.mainCamera;
    item.procesor = data?.procesor;
    item.bluetooth = data?.bluetooth;
    item.wifi = data?.wifi;
    item.network = data?.network;
    item.price = data?.price;
    item.createdAt = new Date(data?.created_at);

    if (options.loadCategory) {
      item.category = (await this.services.categoryService.getById(
        item.categoryId
      )) as CategoryModel;
    }

    if (options.loadPhotos) {
      item.photos = await this.getAllPhotosByArticleId(item.articleId);
    }

    return item;
  }

  public async getAll(): Promise<ArticleModel[] | IErrorResponse | null> {
    return this.getAllArticlesFromTable();
  }

  private async getAllArticlesFromTable(): Promise<ArticleModel[]> {
    const sql = `
        SELECT
            *
        FROM
            article
        ORDER BY
            price ASC;`;
    const [rows] = await this.db.execute(sql);

    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    const items: ArticleModel[] = [];

    for (const row of rows as any) {
      items.push({
        articleId: +(row?.article_id),
        name: row?.name,
        description: row?.description,
        os: row?.os,
        ramMemory: row?.ramMemory,
        internalMemory: row?.internalMemory,
        resolution: row?.resolution,
        displaySize: row?.displaySize,
        selfieCamera: row?.selfieCamera,
        mainCamera: row?.mainCamera,
        procesor: row?.procesor,
        bluetooth: row?.bluetooth,
        wifi: row?.wifi,
        network: row?.network,
        createdAt: new Date(row?.created_at),
        categoryId: +(row?.category_id),
        category: await this.services.categoryService.getById(row?.category_id) as CategoryModel,
        price: +(row?.price),
        photos: await this.getAllPhotosByArticleId(row?.article_id),
      });
    }

    return items;
  }

  private async getAllPhotosByArticleId(
    articleId: number
  ): Promise<ArticlePhoto[]> {
    const sql = `SELECT photo_id, image_path FROM photo WHERE article_id = ?;`;
    const [rows] = await this.db.execute(sql, [articleId]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    return rows.map((row) => {
      return {
        photoId: +row?.photo_id,
        imagePath: row?.image_path,
      };
    });
  }

  public async getById(
    articleId: number,
    options: Partial<ArticleModelAdapterOptions> = {}
  ): Promise<ArticleModel | IErrorResponse | null> {
    return this.getByIdFromTable("article", articleId, options);
  }

  public async add(
    data: IAddArticle,
    uploadedPhotos: IUploadedPhoto[]
  ): Promise<ArticleModel | IErrorResponse> {
    return new Promise<ArticleModel | IErrorResponse>((resolve) => {
      this.db.beginTransaction().then(() => {
        this.db
          .execute(
              `
              INSERT article
              SET
                  category_id         = ?,
                  name                = ?,
                  description         = ?,
                  os                  = ?,
                  ram_memory          = ?,
                  internal_memory     = ?,
                  resolution          = ?,
                  display_size        = ?,
                  selfie_camera       = ?,
                  main_camera         = ?,
                  procesor            = ?,
                  bluetooth           = ?,
                  wifi                = ?,
                  network             = ?,
                  price               = ?;
              `,
            [
              data.categoryId,
              data.name,
              data.description,
              data.os,
              data.ramMemory,
              data.internalMemory,
              data.resolution,
              data.displaySize,
              data.selfieCamera,
              data.mainCamera,
              data.procesor,
              data.bluetooth,
              data.wifi,
              data.network,
              data.price,
            ]
          )
          .then(async (res: any) => {
            const newArticleId: number = +res[0]?.insertId;

            const promises = [];

            for (const uploadedPhoto of uploadedPhotos) {
              promises.push(
                this.db.execute(
                  `INSERT photo SET article_id = ?, image_path = ?;`,
                  [newArticleId, uploadedPhoto.imagePath]
                )
              );
            }

            Promise.all(promises)
              .then(async () => {
                await this.db.commit();

                resolve(
                  await this.services.articleService.getById(newArticleId, {
                    loadCategory: true,
                    loadPhotos: true,
                  })
                );
              })
              .catch(async (error) => {
                await this.db.rollback();

                resolve({
                  errorCode: error?.errno,
                  errorMessage: error?.sqlMessage,
                });
              });
          })
          .catch(async (error) => {
            await this.db.rollback();

            resolve({
              errorCode: error?.errno,
              errorMessage: error?.sqlMessage,
            });
          });
      });
    });
  }

  private editArticle(articleId: number, data: IEditArticle) {
    return this.db.execute(
      `UPDATE
                article
            SET
                name                = ?,
                description         = ?,
                os                  = ?,
                ram_memory          = ?,
                internal_memory     = ?,
                resolution          = ?,
                display_size        = ?,
                selfie_camera       = ?,
                main_camera         = ?,
                procesor            = ?,
                bluetooth           = ?,
                wifi                = ?,
                network             = ?,
                price               = ?,
            WHERE
                article_id = ?;`,
      [
        data.name,
        data.description,
        data.os,
        data.ramMemory,
        data.internalMemory,
        data.resolution,
        data.displaySize,
        data.selfieCamera,
        data.mainCamera,
        data.procesor,
        data.bluetooth,
        data.wifi,
        data.network,
        data.price,
        articleId,
      ]
    );
  }

  public async edit(
    articleId: number,
    data: IEditArticle
  ): Promise<ArticleModel | null | IErrorResponse> {
    return new Promise<ArticleModel | null | IErrorResponse>(
      async (resolve) => {
        const currentArticle = await this.getById(articleId, {});

        if (currentArticle === null) {
          return resolve(null);
        }

        const rollBackAndResolve = async (error) => {
          await this.db.rollback();
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage,
          });
        };
        this.db
          .beginTransaction()
          .then(() => {
            this.editArticle(articleId, data).catch((error) => {
              rollBackAndResolve({
                errno: error?.errno,
                sqlMessage: "Part article: " + error?.sqlMessage,
              });
            });
          })
          .then(async () => {
            this.db.commit().catch((error) => {
              rollBackAndResolve({
                errno: error?.errno,
                sqlMessage: `Part save changes: ${error.sqlMessage}`,
              });
            });
          })
          .then(async () => {
            resolve(
              await this.getById(articleId, {
                loadCategory: true,
                loadPhotos: true,
                loadPrices: true,
              })
            );
          })
          .catch(async (error) => {
            await this.db.rollback();

            resolve({
              errorCode: error?.errno,
              errorMessage: error?.sqlMessage,
            });
          });
      }
    );
  }

  private async deleteArticlePhotoRecords(
    articleId: number
  ): Promise<string[]> {
    return new Promise<string[]>(async (resolve) => {
      const [rows] = await this.db.execute(
        `SELECT image_path FROM photo WHERE article_id = ?;`,
        [articleId]
      );

      if (!Array.isArray(rows) || rows.length === 0) return resolve([]);

      const filesToDelete = rows.map((row) => row?.image_path);

      this.db
        .execute(`DELETE FROM photo WHERE article_id = ?;`, [articleId])
        .then(() => resolve(filesToDelete))
        .catch(() => resolve([]));

      resolve(filesToDelete);
    });
  }

  private async deleteArticleRecord(articleId: number): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      this.db
        .execute(`DELETE FROM article WHERE article_id = ?;`, [articleId])
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  private deleteArticlePhotosAndResizedVersion(filesToDelete: string[]) {
    try {
      for (const filetoDelete of filesToDelete) {
        fs.unlinkSync(filetoDelete);

        const pathParts = path.parse(filetoDelete);

        const directory = pathParts.dir;
        const fileName = pathParts.name;
        const extension = pathParts.ext;

        for (const resizeSpecification of Config.fileUpload.photos.resizes) {
          const resizedImagePath =
            directory + "/" + fileName + resizeSpecification.sufix + extension;

          fs.unlinkSync(resizedImagePath);
        }
      }
    } catch (e) {}
  }

  public async delete(articleId: number): Promise<IErrorResponse | null> {
    return new Promise<IErrorResponse>(async (resolve) => {
      const currentArticle = await this.getById(articleId, {
        loadPhotos: true,
        loadPrices: true,
      });

      if (currentArticle === null) {
        return resolve(null);
      }

      this.db
        .beginTransaction()
        .then(async () => {
          const filesToDelete = await await this.deleteArticlePhotoRecords(
            articleId
          );
          if (filesToDelete.length !== 0) return filesToDelete;
          throw {
            errno: -1005,
            sqlMessage: "Could not delete article photo records.",
          };
        })
        .then(async (filesToDelete) => {
          if (await this.deleteArticleRecord(articleId)) return filesToDelete;
          throw {
            errno: -1006,
            sqlMessage: "Could not delete the article records.",
          };
        })
        .then(async (filesToDelete) => {
          await this.db.commit();
          return filesToDelete;
        })
        .then((filesToDelete) => {
          this.deleteArticlePhotosAndResizedVersion(filesToDelete);
        })
        .then(() => {
          resolve({
            errorCode: 0,
            errorMessage: "Article deleted!",
          });
        })
        .catch(async (error) => {
          await this.db.rollback();
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage,
          });
        });
    });
  }

  public async deleteArticlePhoto(
    articleId: number,
    photoId: number
  ): Promise<IErrorResponse | null> {
    return new Promise<IErrorResponse | null>(async (resolve) => {
      const article = await this.getById(articleId, {
        loadPhotos: true,
      });

      if (article === null) {
        return resolve(null);
      }
      const filteredPhotos = (article as ArticleModel).photos.filter(
        (p) => p.photoId === photoId
      );

      if (filteredPhotos.length === 0) {
        return resolve(null);
      }

      const photo = filteredPhotos[0];

      this.db
        .execute(`DELETE FROM photo WHERE photo_id = ?;`, [photo.photoId])
        .then(() => {
          this.deleteArticlePhotosAndResizedVersion([photo.imagePath]);

          resolve({
            errorCode: 0,
            errorMessage: "Photo Deleted",
          });
        })
        .catch((error) =>
          resolve({
            errorCode: error?.errno,
            errorMessage: error?.sqlMessage,
          })
        );
    });
  }

  public async addArticlePhotos(
    articleId: number,
    uploadedPhotos: IUploadedPhoto[]
  ): Promise<ArticleModel | IErrorResponse | null> {
    return new Promise<ArticleModel | IErrorResponse | null>(
      async (resolve) => {
        const article = await this.getById(articleId, {
          loadPhotos: true,
        });

        if (article === null) {
          return resolve(null);
        }

        this.db
          .beginTransaction()
          .then(() => {
            const promises = [];

            for (const uploadedPhoto of uploadedPhotos) {
              promises.push(
                this.db.execute(
                  `INSERT photo SET article_id = ?, image_path = ?;`,
                  [articleId, uploadedPhoto.imagePath]
                )
              );
            }
            Promise.all(promises)
              .then(async () => {
                await this.db.commit();

                resolve(
                  await this.services.articleService.getById(articleId, {
                    loadCategory: true,
                    loadPhotos: true,
                  })
                );
              })
              .catch(async (error) => {
                await this.db.rollback();

                resolve({
                  errorCode: error?.errno,
                  errorMessage: error?.sqlMessage,
                });
              });
          })
          .catch(async (error) => {
            await this.db.rollback();

            resolve({
              errorCode: error?.errno,
              errorMessage: error?.sqlMessage,
            });
          });
      }
    );
  }

  public async getAllByCategoryId(categoryId: number): Promise<ArticleModel[]> {
    return await this.getAllByFieldNameFromTable<ArticleModelAdapterOptions>("article", "category_id", categoryId, {
        loadPhotos: true,
    }) as ArticleModel[];
}
}

export default ArticleService;

import Ajv from "ajv";

interface IAddArticle {
    categoryId: number;
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
    price: number;
}

interface IUploadedPhoto {
    imagePath: string;
}

const ajv = new Ajv();

const IAddArticleValidator = ajv.compile({
    type: "object",
    properties: {
        categoryId: {
            type: "integer",
            minimum: 1,
        },
        name: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        os: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        ramMemory: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        internalMemory: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        resolution: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        displaySize: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        selfieCamera: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        mainCamera: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        procesor: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        bluetooth: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        wifi: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        network: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        price: {
            type: "number",
            minimum: 0.01,
            multipleOf: 0.01,
        },
    },
    required: [
        "name",
        "description",
        "os",
        "ramMemory",
        "internalMemory",
        "resolution",
        "displaySize",
        "selfieCamera",
        "mainCamera",
        "procesor",
        "bluetooth",
        "wifi",
        "network",
        "price",
        "categoryId",
    ],
    additionalProperties: false,
});

export { IAddArticle };
export { IAddArticleValidator };
export { IUploadedPhoto };

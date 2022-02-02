/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */


import {ReviewStatus} from "/@/api/model/ReviewStatus";

export type ReviewAdminListView = {
    id: number;
    createdAt: string;
    status: ReviewStatus;
    title: string;
    nickname: string;
    detail: string;
    productName: string;
    productSKU: string;
    imageCount: number;
    rating: number;
}

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */


import {ResultSizeQualifier} from "/@/api/model/ResultSizeQualifier";

export type ResultPageContext = {
    pageNumber: number;
    perPage: number;
    size: number;
    sizeQualifier: ResultSizeQualifier;
    nextCursor: string | null;
    prevCursor: string | null;
}

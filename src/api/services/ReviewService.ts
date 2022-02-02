/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import {ResultSetReviewAdminListView} from "/@/api/model/ResultSetReviewAdminListView";

export class ReviewService {

  /**
   * List Reviews
   * @returns ResultSetReviewAdminListView OK
   * @throws ApiError
   */
  public static listReviews({
                              cursor,
                              perPage = 20,
                              prevCursor,
                              query,
                              sort,
                            }: {
    cursor?: string,
    perPage?: number,
    prevCursor?: string,
    query?: string,
    sort?: string,
  }): Promise<ResultSetReviewAdminListView> {
    console.log("finding results for query:", query)
    const result: ResultSetReviewAdminListView = {
      "results": [
        {"id":1,"createdAt":"2022-02-02T03:26:58.439+00:00","status":"PENDING","title":"my review title","nickname":"mr reviewer","detail":"this is my review","productName":"Shovel","productSKU":"1234SHVL","imageCount":2,"rating":5}
      ],
      "pageContext": {
        "pageNumber": 1,
        "perPage": 20,
        "size": 0,
        "sizeQualifier": "EXACT",
        "nextCursor": null,
        "prevCursor": null
      },
      "filterConfig": {
        "imageCount": {
          "type": "options",
          "operators": ["="],
          "label": "Image Count",
          "options": [[true, "Yes"], [false, "No"]]
        },
        "createdAt": {"type": "date", "operators": ["=", "!=", ">", ">=", "<", "<="], "label": "Created At"},
        "nickname": {
          "type": "string",
          "operators": ["~", "=", "!=", ">", ">=", "<", "<=", "in", "!in"],
          "label": "Nickname"
        },
        "rating": {"type": "numeric", "operators": ["=", "!=", ">", ">=", "<", "<="], "label": "Rating"},
        "detail": {
          "type": "string",
          "operators": ["~", "=", "!=", ">", ">=", "<", "<=", "in", "!in"],
          "label": "Detail"
        },
        "title": {"type": "string", "operators": ["~", "=", "!=", ">", ">=", "<", "<=", "in", "!in"], "label": "Title"},
        "productName": {"type": "string", "operators": ["~", "=", ">", ">=", "<", "<="], "label": "Product Name"},
        "status": {
          "type": "options",
          "operators": ["=", "!=", "in", "!in"],
          "label": "Status",
          "options": [["APPROVED", "Approved"], ["NOT_APPROVED", "Not Approved"], ["PENDING", "Pending"], ["EXPIRED", "Expired"]]
        }
      },
      "sortConfig": {}
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(result);
      }, 300);
    });
  }
}

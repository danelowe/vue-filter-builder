import {ResultPageContext} from "/@/api/model/ResultPageContext";
import {SingleFilterConfig} from "/@/lib/filters";
import {SortDirection} from "/@/api/model/SortDirection";
import {ReviewAdminListView} from "/@/api/model/ReviewAdminListView";

export type ResultSetReviewAdminListView = {
    results: Array<ReviewAdminListView>;
    pageContext: ResultPageContext;
    filterConfig: Record<string, SingleFilterConfig>;
    sortConfig: Record<string, Array<SortDirection>>;
}

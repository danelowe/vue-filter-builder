import {FilterUIType} from "/@/api/model/FilterUIType";
import {FilterOperator} from "/@/lib/filters";
import {Option} from "/@/api/model/Option";

export type SingleFilterConfig = {
    type: FilterUIType;
    operators: Array<FilterOperator>;
    label: string;
    options: Array<Option>;
}

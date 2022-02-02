# Filters UI

> This is a prototype and work in progress. There are a lot of corners cut, and some methods are a bit messy.
> The original intent of this code was to guide the design of the backend API.

The UI was inspired by [this commercially available component library](https://community.devexpress.com/blogs/javascript/archive/2018/04/25/devextreme-datagrid-and-treelist-integrated-filter-builder-v18-1.aspx),
however I have not used or seen that code, and this implementation is designed for building filters compatible with a specific backend.

## Run it and play

```
npm install
npm run dev
```

Open http://localhost:3000

There is a single page. The data is hardcoded so will not change.

Use the dropdowns and inputs in the header row to modify the filter. Hit enter or click _Search_ to update the URL.
Refresh the page and the filter should still be applied.

Click on the filter (in purple), to open a modal where more complicated (nested) filters can be generated

The filter above the table shows a human-friendly representation of the filter.
After hitting _Search_ the query that would be sent to the backend is logged to the console.
The backend reads this filter using an Antlr parser I created for the custom filter language.

We could add the same filter string as the URL parameter,
however the parsing code would add quite a bit of weight to the page.
For this reason, the URL parameter is an ugly but easily parsable minimised representation of the filter,
which has then been base64 encoded.

The full representation of the filter is shown below the table,
along with the config that is used to generate the filter UI

## Things to note:
* The filter options available are generated based on 'Filter Config' that is returned from the backend.
* The filter is sent to the backend as a string in a custom language parsed with the help of Antlr
* I wanted to be able to use any applied filter (from the URL parameter) before retrieving the full config from the backend.
 In order to render the filter as a string readable by the backend, some information about the data type is needed.
  So the 'compressed' filter in the URL keeps some metadata about the data type for any attribute that is already filtered.
  This does lead to some messy code to compress and uncompress the URL parameter.
  I'm aware this code might be hard to read, but this was just a prototype.
* 'Interim Config' refers to the filter config generated from the metadata in the URL parameter.
* Everything under `src/api` would usually be generated by `openapi-typescript-codegen` based on the OpenAPI spec from the backend.
  The interfaces have been simplified considerably.
* I created a `useResults()` method that takes an API method as a parameter and returns the results, config etc. from the backend as refs, and manages the retrieving of data as new filters are submitted.
* `useAuth()` gives access to the authentication state. A navigation guard is set up for all pages to require login.
  This is currently hardcoded to always be authorized, but can be hooked into Keycloak.
* The DataTable component allows for flexible display of data.
  One can specify a component type to use for the display of cells in any column.
* Date representations _should_ be localized, but I haven't tested that yet.
* The full solution involves different filter types including presets that can be saved.

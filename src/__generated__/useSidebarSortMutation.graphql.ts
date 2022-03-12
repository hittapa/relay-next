/**
 * @generated SignedSource<<432dc8dc08606b6e7d50cd1787761015>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SortCategoryInput = {
  clientMutationId?: string | null;
  categoryIds: ReadonlyArray<number | null>;
  sort: ReadonlyArray<number | null>;
};
export type useSidebarSortMutation$variables = {
  input: SortCategoryInput;
};
export type useSidebarSortMutationVariables = useSidebarSortMutation$variables;
export type useSidebarSortMutation$data = {
  readonly sortCategory: {
    readonly query: {
      readonly allCategories: {
        readonly __id: string;
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly tagsByCategoryId: {
              readonly __id: string;
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly name: string | null;
                  readonly rowId: number;
                } | null;
              }>;
            };
            readonly rowId: number;
            readonly name: string | null;
            readonly color: string | null;
            readonly organizationId: number;
            readonly configCategoriesByCategoryId: {
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly collapse: boolean | null;
                  readonly sort: number | null;
                } | null;
              }>;
            };
          } | null;
        }>;
      } | null;
    } | null;
  } | null;
};
export type useSidebarSortMutationResponse = useSidebarSortMutation$data;
export type useSidebarSortMutation = {
  variables: useSidebarSortMutationVariables;
  response: useSidebarSortMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
},
v4 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__id",
      "storageKey": null
    }
  ]
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "organizationId",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "collapse",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sort",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useSidebarSortMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SortCategoryPayload",
        "kind": "LinkedField",
        "name": "sortCategory",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CategoriesConnection",
                "kind": "LinkedField",
                "name": "allCategories",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CategoriesEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Category",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TagsConnection",
                            "kind": "LinkedField",
                            "name": "tagsByCategoryId",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "TagsEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Tag",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v2/*: any*/),
                                      (v3/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v2/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ConfigCategoriesConnection",
                            "kind": "LinkedField",
                            "name": "configCategoriesByCategoryId",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ConfigCategoriesEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ConfigCategory",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v7/*: any*/),
                                      (v8/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useSidebarSortMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SortCategoryPayload",
        "kind": "LinkedField",
        "name": "sortCategory",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CategoriesConnection",
                "kind": "LinkedField",
                "name": "allCategories",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CategoriesEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Category",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TagsConnection",
                            "kind": "LinkedField",
                            "name": "tagsByCategoryId",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "TagsEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Tag",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v2/*: any*/),
                                      (v3/*: any*/),
                                      (v9/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v2/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ConfigCategoriesConnection",
                            "kind": "LinkedField",
                            "name": "configCategoriesByCategoryId",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ConfigCategoriesEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ConfigCategory",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v7/*: any*/),
                                      (v8/*: any*/),
                                      (v9/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6154d813ef649dbd3995cf455db1379b",
    "id": null,
    "metadata": {},
    "name": "useSidebarSortMutation",
    "operationKind": "mutation",
    "text": "mutation useSidebarSortMutation(\n  $input: SortCategoryInput!\n) {\n  sortCategory(input: $input) {\n    query {\n      allCategories {\n        edges {\n          node {\n            tagsByCategoryId {\n              edges {\n                node {\n                  name\n                  rowId\n                  id\n                }\n              }\n            }\n            rowId\n            name\n            color\n            organizationId\n            configCategoriesByCategoryId {\n              edges {\n                node {\n                  collapse\n                  sort\n                  id\n                }\n              }\n            }\n            id\n          }\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d0998034ba0fde28b8002ad0dd57453";

export default node;

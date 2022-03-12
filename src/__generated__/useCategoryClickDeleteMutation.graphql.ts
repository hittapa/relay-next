/**
 * @generated SignedSource<<71586ac8dde755a2166731308aae5f7a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteCategoryInput = {
  clientMutationId?: string | null;
  categoryId: number;
};
export type useCategoryClickDeleteMutation$variables = {
  input: DeleteCategoryInput;
  connections: ReadonlyArray<string>;
};
export type useCategoryClickDeleteMutationVariables = useCategoryClickDeleteMutation$variables;
export type useCategoryClickDeleteMutation$data = {
  readonly deleteCategory: {
    readonly category: {
      readonly __id: string;
    } | null;
    readonly query: {
      readonly allMessages: {
        readonly nodes: ReadonlyArray<{
          readonly messageTagsByMessageId: {
            readonly __id: string;
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly messageId: number;
              } | null;
            }>;
          };
          readonly content: string | null;
        } | null>;
      } | null;
      readonly allCategories: {
        readonly __id: string;
      } | null;
    } | null;
  } | null;
};
export type useCategoryClickDeleteMutationResponse = useCategoryClickDeleteMutation$data;
export type useCategoryClickDeleteMutation = {
  variables: useCategoryClickDeleteMutationVariables;
  response: useCategoryClickDeleteMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__id",
  "storageKey": null
},
v4 = {
  "kind": "ClientExtension",
  "selections": [
    (v3/*: any*/)
  ]
},
v5 = [
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "MessageTagsEdge",
  "kind": "LinkedField",
  "name": "edges",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "MessageTag",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "messageId",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = {
  "kind": "ClientExtension",
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "filters": null,
      "handle": "deleteEdge",
      "key": "",
      "kind": "ScalarHandle",
      "name": "__id",
      "handleArgs": [
        {
          "kind": "Variable",
          "name": "connections",
          "variableName": "connections"
        }
      ]
    }
  ]
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useCategoryClickDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteCategoryPayload",
        "kind": "LinkedField",
        "name": "deleteCategory",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Category",
            "kind": "LinkedField",
            "name": "category",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
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
                "concreteType": "MessagesConnection",
                "kind": "LinkedField",
                "name": "allMessages",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Message",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "MessageTagsConnection",
                        "kind": "LinkedField",
                        "name": "messageTagsByMessageId",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "CategoriesConnection",
                "kind": "LinkedField",
                "name": "allCategories",
                "plural": false,
                "selections": (v5/*: any*/),
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "useCategoryClickDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteCategoryPayload",
        "kind": "LinkedField",
        "name": "deleteCategory",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Category",
            "kind": "LinkedField",
            "name": "category",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          },
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
                "concreteType": "MessagesConnection",
                "kind": "LinkedField",
                "name": "allMessages",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Message",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "MessageTagsConnection",
                        "kind": "LinkedField",
                        "name": "messageTagsByMessageId",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "CategoriesConnection",
                "kind": "LinkedField",
                "name": "allCategories",
                "plural": false,
                "selections": [
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fe60422f6ccd59469ade3e96ea3d518a",
    "id": null,
    "metadata": {},
    "name": "useCategoryClickDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation useCategoryClickDeleteMutation(\n  $input: DeleteCategoryInput!\n) {\n  deleteCategory(input: $input) {\n    category {\n      id\n    }\n    query {\n      allMessages {\n        nodes {\n          messageTagsByMessageId {\n            edges {\n              node {\n                messageId\n              }\n            }\n          }\n          content\n          id\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b1806be3e5da71375ed261eddf597eed";

export default node;

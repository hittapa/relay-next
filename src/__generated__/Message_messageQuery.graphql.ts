/**
 * @generated SignedSource<<bfd5620dce9c1b4f8b6080a442214da1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Message_messageQuery$variables = {
  message: number;
  organization: number;
  tag?: ReadonlyArray<number | null> | null;
};
export type Message_messageQueryVariables = Message_messageQuery$variables;
export type Message_messageQuery$data = {
  readonly query: {
    readonly " $fragmentSpreads": FragmentRefs<"Message_messageFragment" | "SidebarFragment_messages" | "SidebarFragment_categories" | "NavFragment_organization">;
  };
};
export type Message_messageQueryResponse = Message_messageQuery$data;
export type Message_messageQuery = {
  variables: Message_messageQueryVariables;
  response: Message_messageQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "message"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "organization"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "tag"
  }
],
v1 = {
  "kind": "Variable",
  "name": "organization",
  "variableName": "organization"
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "tag",
    "variableName": "tag"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "organizationId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "kind": "Variable",
  "name": "organizationId",
  "variableName": "organization"
},
v7 = {
  "kind": "Variable",
  "name": "tagId",
  "variableName": "tag"
},
v8 = {
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
v9 = [
  (v6/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Message_messageQuery",
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
            "args": [
              {
                "kind": "Variable",
                "name": "message",
                "variableName": "message"
              }
            ],
            "kind": "FragmentSpread",
            "name": "Message_messageFragment"
          },
          {
            "args": (v2/*: any*/),
            "kind": "FragmentSpread",
            "name": "SidebarFragment_messages"
          },
          {
            "args": (v2/*: any*/),
            "kind": "FragmentSpread",
            "name": "SidebarFragment_categories"
          },
          {
            "args": [
              (v1/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "NavFragment_organization"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Message_messageQuery",
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
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Variable",
                    "name": "rowId",
                    "variableName": "message"
                  }
                ],
                "concreteType": "Message",
                "kind": "LinkedField",
                "name": "messageByRowId",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "content",
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "loomSharedUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MessageTagsConnection",
                    "kind": "LinkedField",
                    "name": "messageTagsByMessageId",
                    "plural": false,
                    "selections": [
                      {
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
                                "name": "tagId",
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
                  (v5/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "concreteType": "MessagesConnection",
            "kind": "LinkedField",
            "name": "tile",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "MessagesEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Message",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "MessageTagsConnection",
                        "kind": "LinkedField",
                        "name": "messageTagsByMessageId",
                        "plural": false,
                        "selections": [
                          {
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
                          (v8/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "concreteType": "CategoriesConnection",
            "kind": "LinkedField",
            "name": "sidebarCategories",
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
                                  (v4/*: any*/),
                                  (v10/*: any*/),
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v8/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "color",
                        "storageKey": null
                      },
                      (v3/*: any*/),
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
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "collapse",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "sort",
                                    "storageKey": null
                                  },
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              (v7/*: any*/)
            ],
            "concreteType": "TagsConnection",
            "kind": "LinkedField",
            "name": "sidebar",
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
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Category",
                        "kind": "LinkedField",
                        "name": "categoryByCategoryId",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
            "kind": "ScalarField",
            "name": "organizationDefault",
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8de7bf9071e0f2535ae17023a9235376",
    "id": null,
    "metadata": {},
    "name": "Message_messageQuery",
    "operationKind": "query",
    "text": "query Message_messageQuery(\n  $message: Int!\n  $organization: Int!\n  $tag: [Int]\n) {\n  query {\n    ...Message_messageFragment_4mgSYr\n    ...SidebarFragment_messages_46bejI\n    ...SidebarFragment_categories_46bejI\n    ...NavFragment_organization_1rgJoH\n    id\n  }\n}\n\nfragment Message_messageFragment_4mgSYr on Query {\n  query {\n    messageByRowId(rowId: $message) {\n      content\n      organizationId\n      rowId\n      loomSharedUrl\n      messageTagsByMessageId {\n        edges {\n          node {\n            tagId\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment NavFragment_organization_1rgJoH on Query {\n  organizationDefault(organizationId: $organization)\n}\n\nfragment SidebarFragment_categories_46bejI on Query {\n  sidebarCategories(organizationId: $organization) {\n    edges {\n      node {\n        tagsByCategoryId {\n          edges {\n            node {\n              rowId\n              name\n              id\n            }\n          }\n        }\n        rowId\n        name\n        color\n        organizationId\n        configCategoriesByCategoryId {\n          edges {\n            node {\n              collapse\n              sort\n              id\n            }\n          }\n        }\n        id\n      }\n    }\n  }\n  sidebar(tagId: $tag) {\n    edges {\n      node {\n        categoryByCategoryId {\n          rowId\n          id\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment SidebarFragment_messages_46bejI on Query {\n  tile(organizationId: $organization, tagId: $tag) {\n    edges {\n      node {\n        messageTagsByMessageId {\n          edges {\n            node {\n              messageId\n            }\n          }\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "21247d56ba7dd66d366b388d2c0a51db";

export default node;

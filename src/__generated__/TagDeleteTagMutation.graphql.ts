/**
 * @generated SignedSource<<63765d2caa71d3e393a2375298d7be87>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteTagInput = {
  clientMutationId?: string | null;
  tagId: number;
};
export type DeleteMessageTagInput = {
  clientMutationId?: string | null;
  tagId: number;
};
export type TagDeleteTagMutation$variables = {
  tag: DeleteTagInput;
  messageTag: DeleteMessageTagInput;
  tagConnections: ReadonlyArray<string>;
  messageTagConnections: ReadonlyArray<string>;
};
export type TagDeleteTagMutationVariables = TagDeleteTagMutation$variables;
export type TagDeleteTagMutation$data = {
  readonly deleteMessageTag: {
    readonly query: {
      readonly allMessages: {
        readonly nodes: ReadonlyArray<{
          readonly messageTagsByMessageId: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly messageId: number;
                readonly tagByTagId: {
                  readonly id: string;
                } | null;
              } | null;
            }>;
          };
          readonly content: string | null;
        } | null>;
      } | null;
    } | null;
  } | null;
  readonly deleteTag: {
    readonly tag: {
      readonly id: string;
    } | null;
  } | null;
};
export type TagDeleteTagMutationResponse = TagDeleteTagMutation$data;
export type TagDeleteTagMutation = {
  variables: TagDeleteTagMutationVariables;
  response: TagDeleteTagMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "messageTag"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "messageTagConnections"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "tag"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "tagConnections"
},
v4 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "messageTag"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "messageId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  (v6/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
},
v9 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "tag"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TagDeleteTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "DeleteMessageTagPayload",
        "kind": "LinkedField",
        "name": "deleteMessageTag",
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
                                  (v5/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Tag",
                                    "kind": "LinkedField",
                                    "name": "tagByTagId",
                                    "plural": false,
                                    "selections": (v7/*: any*/),
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
      },
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "DeleteTagPayload",
        "kind": "LinkedField",
        "name": "deleteTag",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Tag",
            "kind": "LinkedField",
            "name": "tag",
            "plural": false,
            "selections": (v7/*: any*/),
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
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "TagDeleteTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "DeleteMessageTagPayload",
        "kind": "LinkedField",
        "name": "deleteMessageTag",
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
                                  (v5/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Tag",
                                    "kind": "LinkedField",
                                    "name": "tagByTagId",
                                    "plural": false,
                                    "selections": [
                                      (v6/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "filters": null,
                                        "handle": "deleteEdge",
                                        "key": "",
                                        "kind": "ScalarHandle",
                                        "name": "id",
                                        "handleArgs": [
                                          {
                                            "kind": "Variable",
                                            "name": "connections",
                                            "variableName": "messageTagConnections"
                                          }
                                        ]
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
                      (v8/*: any*/),
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "DeleteTagPayload",
        "kind": "LinkedField",
        "name": "deleteTag",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Tag",
            "kind": "LinkedField",
            "name": "tag",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "filters": null,
                "handle": "deleteEdge",
                "key": "",
                "kind": "ScalarHandle",
                "name": "id",
                "handleArgs": [
                  {
                    "kind": "Variable",
                    "name": "connections",
                    "variableName": "tagConnections"
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "93e199bb4ad090d77039a93a860a123e",
    "id": null,
    "metadata": {},
    "name": "TagDeleteTagMutation",
    "operationKind": "mutation",
    "text": "mutation TagDeleteTagMutation(\n  $tag: DeleteTagInput!\n  $messageTag: DeleteMessageTagInput!\n) {\n  deleteMessageTag(input: $messageTag) {\n    query {\n      allMessages {\n        nodes {\n          messageTagsByMessageId {\n            edges {\n              node {\n                messageId\n                tagByTagId {\n                  id\n                }\n              }\n            }\n          }\n          content\n          id\n        }\n      }\n      id\n    }\n  }\n  deleteTag(input: $tag) {\n    tag {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "11221e792186b0850bea87f28bb209d1";

export default node;

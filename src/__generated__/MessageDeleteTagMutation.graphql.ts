/**
 * @generated SignedSource<<e22dc18900d1547b10ed09fa55081819>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RemoveMessageTagInput = {
  clientMutationId?: string | null;
  tagId: number;
  messageId: number;
};
export type MessageDeleteTagMutation$variables = {
  input: RemoveMessageTagInput;
  connections: ReadonlyArray<string>;
};
export type MessageDeleteTagMutationVariables = MessageDeleteTagMutation$variables;
export type MessageDeleteTagMutation$data = {
  readonly removeMessageTag: {
    readonly query: {
      readonly allMessages: {
        readonly nodes: ReadonlyArray<{
          readonly messageTagsByMessageId: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly messageId: number;
                readonly tagByTagId: {
                  readonly id: string;
                  readonly rowId: number;
                } | null;
              } | null;
            }>;
          };
          readonly content: string | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};
export type MessageDeleteTagMutationResponse = MessageDeleteTagMutation$data;
export type MessageDeleteTagMutation = {
  variables: MessageDeleteTagMutationVariables;
  response: MessageDeleteTagMutation$data;
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
  "name": "messageId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MessageDeleteTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "RemoveMessageTagPayload",
        "kind": "LinkedField",
        "name": "removeMessageTag",
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
                                  (v3/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Tag",
                                    "kind": "LinkedField",
                                    "name": "tagByTagId",
                                    "plural": false,
                                    "selections": [
                                      (v4/*: any*/),
                                      (v5/*: any*/)
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
                      (v6/*: any*/)
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
    "name": "MessageDeleteTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "RemoveMessageTagPayload",
        "kind": "LinkedField",
        "name": "removeMessageTag",
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
                                  (v3/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Tag",
                                    "kind": "LinkedField",
                                    "name": "tagByTagId",
                                    "plural": false,
                                    "selections": [
                                      (v4/*: any*/),
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
                                            "variableName": "connections"
                                          }
                                        ]
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
                          }
                        ],
                        "storageKey": null
                      },
                      (v6/*: any*/),
                      (v4/*: any*/)
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
    ]
  },
  "params": {
    "cacheID": "05b81de161b88b0d3bdde98bd9fb1a69",
    "id": null,
    "metadata": {},
    "name": "MessageDeleteTagMutation",
    "operationKind": "mutation",
    "text": "mutation MessageDeleteTagMutation(\n  $input: RemoveMessageTagInput!\n) {\n  removeMessageTag(input: $input) {\n    query {\n      allMessages {\n        nodes {\n          messageTagsByMessageId {\n            edges {\n              node {\n                messageId\n                tagByTagId {\n                  id\n                  rowId\n                }\n              }\n            }\n          }\n          content\n          id\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d851be8de9722b24278353104dd5dbdd";

export default node;

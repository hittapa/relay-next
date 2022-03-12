/**
 * @generated SignedSource<<eb14822811534547d490d4a5dd2f36e1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateMessageTagInput = {
  clientMutationId?: string | null;
  messageId: number;
  tagId: number;
  organizationId: number;
};
export type TagInsertMessageTagMutation$variables = {
  input: CreateMessageTagInput;
  connections: ReadonlyArray<string>;
};
export type TagInsertMessageTagMutationVariables = TagInsertMessageTagMutation$variables;
export type TagInsertMessageTagMutation$data = {
  readonly createMessageTag: {
    readonly messageTag: {
      readonly messageId: number;
      readonly tagId: number;
      readonly tagByTagId: {
        readonly name: string | null;
        readonly categoryByCategoryId: {
          readonly color: string | null;
        } | null;
      } | null;
    } | null;
  } | null;
};
export type TagInsertMessageTagMutationResponse = TagInsertMessageTagMutation$data;
export type TagInsertMessageTagMutation = {
  variables: TagInsertMessageTagMutationVariables;
  response: TagInsertMessageTagMutation$data;
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
  "name": "tagId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
    "name": "TagInsertMessageTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMessageTagPayload",
        "kind": "LinkedField",
        "name": "createMessageTag",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "MessageTag",
            "kind": "LinkedField",
            "name": "messageTag",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Tag",
                "kind": "LinkedField",
                "name": "tagByTagId",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Category",
                    "kind": "LinkedField",
                    "name": "categoryByCategoryId",
                    "plural": false,
                    "selections": [
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
    "name": "TagInsertMessageTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMessageTagPayload",
        "kind": "LinkedField",
        "name": "createMessageTag",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "MessageTag",
            "kind": "LinkedField",
            "name": "messageTag",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Tag",
                "kind": "LinkedField",
                "name": "tagByTagId",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Category",
                    "kind": "LinkedField",
                    "name": "categoryByCategoryId",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v7/*: any*/)
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
            "filters": null,
            "handle": "appendNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "messageTag",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "MessageTagsEdge"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e1068d5ceac1f96caab6686400aaea55",
    "id": null,
    "metadata": {},
    "name": "TagInsertMessageTagMutation",
    "operationKind": "mutation",
    "text": "mutation TagInsertMessageTagMutation(\n  $input: CreateMessageTagInput!\n) {\n  createMessageTag(input: $input) {\n    messageTag {\n      messageId\n      tagId\n      tagByTagId {\n        name\n        categoryByCategoryId {\n          color\n          id\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "594b08d68bb1c0975dc2d0b166d2c602";

export default node;

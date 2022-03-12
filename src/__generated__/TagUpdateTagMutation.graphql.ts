/**
 * @generated SignedSource<<01c194557d0c496fe8053fa0eb1562e3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateTagInput = {
  clientMutationId?: string | null;
  id: number;
  name: string;
};
export type TagUpdateTagMutation$variables = {
  input: UpdateTagInput;
};
export type TagUpdateTagMutationVariables = TagUpdateTagMutation$variables;
export type TagUpdateTagMutation$data = {
  readonly updateTag: {
    readonly tag: {
      readonly rowId: number;
      readonly name: string | null;
    } | null;
  } | null;
};
export type TagUpdateTagMutationResponse = TagUpdateTagMutation$data;
export type TagUpdateTagMutation = {
  variables: TagUpdateTagMutationVariables;
  response: TagUpdateTagMutation$data;
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
  "name": "rowId",
  "storageKey": null
},
v3 = {
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
    "name": "TagUpdateTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateTagPayload",
        "kind": "LinkedField",
        "name": "updateTag",
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
              (v2/*: any*/),
              (v3/*: any*/)
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
    "name": "TagUpdateTagMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateTagPayload",
        "kind": "LinkedField",
        "name": "updateTag",
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
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
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
    "cacheID": "6234f41f7e1ad0462658b7f9c32a4939",
    "id": null,
    "metadata": {},
    "name": "TagUpdateTagMutation",
    "operationKind": "mutation",
    "text": "mutation TagUpdateTagMutation(\n  $input: UpdateTagInput!\n) {\n  updateTag(input: $input) {\n    tag {\n      rowId\n      name\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a4338a579269c6ff9a6a27c5fba5b554";

export default node;

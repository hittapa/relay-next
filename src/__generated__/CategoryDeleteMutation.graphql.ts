/**
 * @generated SignedSource<<9839005aea19ba77fa24e6b63400eabd>>
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
export type CategoryDeleteMutation$variables = {
  input: DeleteCategoryInput;
  connections: ReadonlyArray<string>;
};
export type CategoryDeleteMutationVariables = CategoryDeleteMutation$variables;
export type CategoryDeleteMutation$data = {
  readonly deleteCategory: {
    readonly category: {
      readonly __id: string;
    } | null;
  } | null;
};
export type CategoryDeleteMutationResponse = CategoryDeleteMutation$data;
export type CategoryDeleteMutation = {
  variables: CategoryDeleteMutationVariables;
  response: CategoryDeleteMutation$data;
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CategoryDeleteMutation",
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
              {
                "kind": "ClientExtension",
                "selections": [
                  (v3/*: any*/)
                ]
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
    "name": "CategoryDeleteMutation",
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
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
    "cacheID": "4a23482dcfb2fbb2a9a0142b7609779e",
    "id": null,
    "metadata": {},
    "name": "CategoryDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation CategoryDeleteMutation(\n  $input: DeleteCategoryInput!\n) {\n  deleteCategory(input: $input) {\n    category {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9f1aa0a47a513a8df16fc36e42e816ca";

export default node;

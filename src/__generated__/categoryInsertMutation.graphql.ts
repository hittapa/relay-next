/**
 * @generated SignedSource<<0fe703e8b97d08d1583034767966fa26>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateCategoryInput = {
  clientMutationId?: string | null;
  organizationId: number;
  name: string;
  color: string;
};
export type categoryInsertMutation$variables = {
  input: CreateCategoryInput;
};
export type categoryInsertMutationVariables = categoryInsertMutation$variables;
export type categoryInsertMutation$data = {
  readonly createCategory: {
    readonly category: {
      readonly rowId: number;
      readonly name: string | null;
      readonly color: string | null;
      readonly organizationId: number;
    } | null;
  } | null;
};
export type categoryInsertMutationResponse = categoryInsertMutation$data;
export type categoryInsertMutation = {
  variables: categoryInsertMutationVariables;
  response: categoryInsertMutation$data;
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
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "organizationId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "categoryInsertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateCategoryPayload",
        "kind": "LinkedField",
        "name": "createCategory",
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
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
    "name": "categoryInsertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateCategoryPayload",
        "kind": "LinkedField",
        "name": "createCategory",
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
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
    "cacheID": "c85deafb598906d4ece3c0275a75aa7f",
    "id": null,
    "metadata": {},
    "name": "categoryInsertMutation",
    "operationKind": "mutation",
    "text": "mutation categoryInsertMutation(\n  $input: CreateCategoryInput!\n) {\n  createCategory(input: $input) {\n    category {\n      rowId\n      name\n      color\n      organizationId\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "926057b673c9bc1feb1e70d4c98aae9c";

export default node;

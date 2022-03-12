/**
 * @generated SignedSource<<07b734caf4dea30b917ba0e65c705393>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateCategoryInput = {
  clientMutationId?: string | null;
  id: number;
  name: string;
  color: string;
};
export type useCategoryClickUpdateMutation$variables = {
  input: UpdateCategoryInput;
};
export type useCategoryClickUpdateMutationVariables = useCategoryClickUpdateMutation$variables;
export type useCategoryClickUpdateMutation$data = {
  readonly updateCategory: {
    readonly category: {
      readonly rowId: number;
      readonly name: string | null;
      readonly color: string | null;
      readonly tagsByCategoryId: {
        readonly __id: string;
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly name: string | null;
          } | null;
        }>;
      };
    } | null;
  } | null;
};
export type useCategoryClickUpdateMutationResponse = useCategoryClickUpdateMutation$data;
export type useCategoryClickUpdateMutation = {
  variables: useCategoryClickUpdateMutationVariables;
  response: useCategoryClickUpdateMutation$data;
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
v6 = {
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
    "name": "useCategoryClickUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateCategoryPayload",
        "kind": "LinkedField",
        "name": "updateCategory",
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
                          (v3/*: any*/)
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
    "name": "useCategoryClickUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateCategoryPayload",
        "kind": "LinkedField",
        "name": "updateCategory",
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
                          (v3/*: any*/),
                          (v6/*: any*/)
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
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "be01c09a00b5fe385b4ee96bfb271187",
    "id": null,
    "metadata": {},
    "name": "useCategoryClickUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation useCategoryClickUpdateMutation(\n  $input: UpdateCategoryInput!\n) {\n  updateCategory(input: $input) {\n    category {\n      rowId\n      name\n      color\n      tagsByCategoryId {\n        edges {\n          node {\n            name\n            id\n          }\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2fd3d97d6c605823b747bfa1a2e676ba";

export default node;

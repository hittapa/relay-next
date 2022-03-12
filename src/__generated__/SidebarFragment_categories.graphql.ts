/**
 * @generated SignedSource<<fea3fbd3ea42f5346a8ee6da6f0d8fe4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SidebarFragment_categories$data = {
  readonly sidebarCategories: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly tagsByCategoryId: {
          readonly __id: string;
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly rowId: number;
              readonly name: string | null;
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
  readonly sidebar: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly categoryByCategoryId: {
          readonly rowId: number;
        } | null;
      } | null;
    }>;
  } | null;
  readonly " $fragmentType": "SidebarFragment_categories";
};
export type SidebarFragment_categories = SidebarFragment_categories$data;
export type SidebarFragment_categories$key = {
  readonly " $data"?: SidebarFragment_categories$data;
  readonly " $fragmentSpreads": FragmentRefs<"SidebarFragment_categories">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
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
};
return {
  "argumentDefinitions": [
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
  "kind": "Fragment",
  "metadata": null,
  "name": "SidebarFragment_categories",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "organizationId",
          "variableName": "organization"
        }
      ],
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
                            (v0/*: any*/),
                            (v1/*: any*/)
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    (v2/*: any*/)
                  ],
                  "storageKey": null
                },
                (v0/*: any*/),
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "color",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "organizationId",
                  "storageKey": null
                },
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
            }
          ],
          "storageKey": null
        },
        (v2/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "tagId",
          "variableName": "tag"
        }
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
                    (v0/*: any*/)
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
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "5b6f9bc1070796ea24d074002547c3f6";

export default node;

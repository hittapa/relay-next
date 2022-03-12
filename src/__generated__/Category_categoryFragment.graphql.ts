/**
 * @generated SignedSource<<ae48eeb85df2b759db6d9c56bdfc10ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Category_categoryFragment$data = {
  readonly query: {
    readonly categoryByRowId: {
      readonly rowId: number;
      readonly name: string | null;
      readonly color: string | null;
      readonly sort: number | null;
      readonly organizationId: number;
      readonly tagsByCategoryId: {
        readonly __id: string;
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly rowId: number;
            readonly name: string | null;
          } | null;
        }>;
      };
    } | null;
  };
  readonly " $fragmentType": "Category_categoryFragment";
};
export type Category_categoryFragment = Category_categoryFragment$data;
export type Category_categoryFragment$key = {
  readonly " $data"?: Category_categoryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"Category_categoryFragment">;
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
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "category"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Category_categoryFragment",
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
              "variableName": "category"
            }
          ],
          "concreteType": "Category",
          "kind": "LinkedField",
          "name": "categoryByRowId",
          "plural": false,
          "selections": [
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
              "name": "sort",
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
                {
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

(node as any).hash = "7060976377893ca7ca20f855c5251e8d";

export default node;

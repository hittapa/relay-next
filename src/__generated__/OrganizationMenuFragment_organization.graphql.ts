/**
 * @generated SignedSource<<4ceb1fd2176d7240da1be94ae4a49cfd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationMenuFragment_organization$data = {
  readonly allOrganizations: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly rowId: number;
        readonly slug: string | null;
      } | null;
    }>;
  } | null;
  readonly " $fragmentType": "OrganizationMenuFragment_organization";
};
export type OrganizationMenuFragment_organization = OrganizationMenuFragment_organization$data;
export type OrganizationMenuFragment_organization$key = {
  readonly " $data"?: OrganizationMenuFragment_organization$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMenuFragment_organization">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationMenuFragment_organization",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "OrganizationsConnection",
      "kind": "LinkedField",
      "name": "allOrganizations",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "OrganizationsEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Organization",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "rowId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "slug",
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

(node as any).hash = "d12019fd6046c9837172e9df74fac621";

export default node;

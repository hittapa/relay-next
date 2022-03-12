/**
 * @generated SignedSource<<ea8c6ec7c0101e44002b1c1c396bc78f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationMenuFragment_invite$data = {
  readonly allInvites: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly organizationId: number;
        readonly email: string | null;
      } | null;
    }>;
  } | null;
  readonly " $fragmentType": "OrganizationMenuFragment_invite";
};
export type OrganizationMenuFragment_invite = OrganizationMenuFragment_invite$data;
export type OrganizationMenuFragment_invite$key = {
  readonly " $data"?: OrganizationMenuFragment_invite$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMenuFragment_invite">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "organization"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationMenuFragment_invite",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "fields": [
            {
              "kind": "Variable",
              "name": "organizationId",
              "variableName": "organization"
            }
          ],
          "kind": "ObjectValue",
          "name": "condition"
        }
      ],
      "concreteType": "InvitesConnection",
      "kind": "LinkedField",
      "name": "allInvites",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "InvitesEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Invite",
              "kind": "LinkedField",
              "name": "node",
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
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "organizationId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "email",
                  "storageKey": null
                }
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
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "ef32f32d2a5d82ee31fefb2ac8ea3300";

export default node;

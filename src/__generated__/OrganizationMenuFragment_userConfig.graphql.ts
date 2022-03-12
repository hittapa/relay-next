/**
 * @generated SignedSource<<6f8440c61a507766a964cd0f44f28183>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationMenuFragment_userConfig$data = {
  readonly allUserConfigs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly defaultOrganization: number;
      } | null;
    }>;
  } | null;
  readonly " $fragmentType": "OrganizationMenuFragment_userConfig";
};
export type OrganizationMenuFragment_userConfig = OrganizationMenuFragment_userConfig$data;
export type OrganizationMenuFragment_userConfig$key = {
  readonly " $data"?: OrganizationMenuFragment_userConfig$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMenuFragment_userConfig">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationMenuFragment_userConfig",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "UserConfigsConnection",
      "kind": "LinkedField",
      "name": "allUserConfigs",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "UserConfigsEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "UserConfig",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "defaultOrganization",
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

(node as any).hash = "4f8dcfff3591e8bf022a0491f7096d41";

export default node;

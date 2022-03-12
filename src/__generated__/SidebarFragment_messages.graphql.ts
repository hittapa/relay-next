/**
 * @generated SignedSource<<a1f1d1e2314a546170e0ebfdc01c28c6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SidebarFragment_messages$data = {
  readonly tile: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly messageTagsByMessageId: {
          readonly __id: string;
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly messageId: number;
            } | null;
          }>;
        };
      } | null;
    }>;
  } | null;
  readonly " $fragmentType": "SidebarFragment_messages";
};
export type SidebarFragment_messages = SidebarFragment_messages$data;
export type SidebarFragment_messages$key = {
  readonly " $data"?: SidebarFragment_messages$data;
  readonly " $fragmentSpreads": FragmentRefs<"SidebarFragment_messages">;
};

const node: ReaderFragment = {
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
  "name": "SidebarFragment_messages",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "organizationId",
          "variableName": "organization"
        },
        {
          "kind": "Variable",
          "name": "tagId",
          "variableName": "tag"
        }
      ],
      "concreteType": "MessagesConnection",
      "kind": "LinkedField",
      "name": "tile",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "MessagesEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Message",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "MessageTagsConnection",
                  "kind": "LinkedField",
                  "name": "messageTagsByMessageId",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "MessageTagsEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "MessageTag",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "messageId",
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

(node as any).hash = "ae9df0156cc36bb914ac9b56f3744ba7";

export default node;

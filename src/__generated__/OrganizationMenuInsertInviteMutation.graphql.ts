/**
 * @generated SignedSource<<215e209fbec440634a571bf6d9364e5c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateInviteInput = {
  clientMutationId?: string | null;
  organizationId: number;
  email: string;
};
export type OrganizationMenuInsertInviteMutation$variables = {
  input: CreateInviteInput;
  connections: ReadonlyArray<string>;
};
export type OrganizationMenuInsertInviteMutationVariables = OrganizationMenuInsertInviteMutation$variables;
export type OrganizationMenuInsertInviteMutation$data = {
  readonly createInvite: {
    readonly invite: {
      readonly organizationId: number;
      readonly email: string | null;
    } | null;
  } | null;
};
export type OrganizationMenuInsertInviteMutationResponse = OrganizationMenuInsertInviteMutation$data;
export type OrganizationMenuInsertInviteMutation = {
  variables: OrganizationMenuInsertInviteMutationVariables;
  response: OrganizationMenuInsertInviteMutation$data;
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
  "name": "organizationId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
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
    "name": "OrganizationMenuInsertInviteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateInvitePayload",
        "kind": "LinkedField",
        "name": "createInvite",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Invite",
            "kind": "LinkedField",
            "name": "invite",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
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
    "name": "OrganizationMenuInsertInviteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateInvitePayload",
        "kind": "LinkedField",
        "name": "createInvite",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Invite",
            "kind": "LinkedField",
            "name": "invite",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "invite",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "InvitesEdge"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "56e4e06f598b621bb73045dc217ae328",
    "id": null,
    "metadata": {},
    "name": "OrganizationMenuInsertInviteMutation",
    "operationKind": "mutation",
    "text": "mutation OrganizationMenuInsertInviteMutation(\n  $input: CreateInviteInput!\n) {\n  createInvite(input: $input) {\n    invite {\n      organizationId\n      email\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "53da07343627afa9300288819adc3720";

export default node;

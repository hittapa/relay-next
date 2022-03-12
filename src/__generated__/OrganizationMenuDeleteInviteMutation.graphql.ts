/**
 * @generated SignedSource<<aa6d4923cb60115b9cfe777ee1b23fd3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteInviteInput = {
  clientMutationId?: string | null;
  organizationId: number;
  email: string;
};
export type OrganizationMenuDeleteInviteMutation$variables = {
  input: DeleteInviteInput;
  connections: ReadonlyArray<string>;
};
export type OrganizationMenuDeleteInviteMutationVariables = OrganizationMenuDeleteInviteMutation$variables;
export type OrganizationMenuDeleteInviteMutation$data = {
  readonly deleteInvite: {
    readonly invite: {
      readonly id: string;
      readonly organizationId: number;
      readonly email: string | null;
    } | null;
  } | null;
};
export type OrganizationMenuDeleteInviteMutationResponse = OrganizationMenuDeleteInviteMutation$data;
export type OrganizationMenuDeleteInviteMutation = {
  variables: OrganizationMenuDeleteInviteMutationVariables;
  response: OrganizationMenuDeleteInviteMutation$data;
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
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "organizationId",
  "storageKey": null
},
v5 = {
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
    "name": "OrganizationMenuDeleteInviteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteInvitePayload",
        "kind": "LinkedField",
        "name": "deleteInvite",
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "OrganizationMenuDeleteInviteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteInvitePayload",
        "kind": "LinkedField",
        "name": "deleteInvite",
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
              {
                "alias": null,
                "args": null,
                "filters": null,
                "handle": "deleteEdge",
                "key": "",
                "kind": "ScalarHandle",
                "name": "id",
                "handleArgs": [
                  {
                    "kind": "Variable",
                    "name": "connections",
                    "variableName": "connections"
                  }
                ]
              },
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8d495e192b01ba84d0474dda2602c1ba",
    "id": null,
    "metadata": {},
    "name": "OrganizationMenuDeleteInviteMutation",
    "operationKind": "mutation",
    "text": "mutation OrganizationMenuDeleteInviteMutation(\n  $input: DeleteInviteInput!\n) {\n  deleteInvite(input: $input) {\n    invite {\n      id\n      organizationId\n      email\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "80f530f08e827136ea90071bf0ca4620";

export default node;

import type { Prisma } from '../../generated/prisma/client.js';

export type UserWithSettings = Prisma.UserGetPayload<{
  include: {
    ownerSettings: true;
    customerSetting: true;
  };
}>;

export type CustomerOwnerWithOwnerUser = Prisma.CustomerOwnerGetPayload<{
  include: {
    owner: {
      include: {
        user: true;
      };
    };
  };
}>;

export type CurrentActiveOwner = {
  id: CustomerOwnerWithOwnerUser['owner']['id'];
  userId: CustomerOwnerWithOwnerUser['owner']['userId'];
  ownerFullName: CustomerOwnerWithOwnerUser['owner']['user']['fullName'] | null;
  ownerMobileNumber:
    | CustomerOwnerWithOwnerUser['owner']['user']['mobileNumber']
    | null;
  ownerEmail: CustomerOwnerWithOwnerUser['owner']['user']['email'] | null;
  ownerAddress: CustomerOwnerWithOwnerUser['owner']['user']['address'] | null;
  dairyName: CustomerOwnerWithOwnerUser['owner']['dairyName'];
  cowEnabled: CustomerOwnerWithOwnerUser['owner']['cowEnabled'];
  cowPrice: CustomerOwnerWithOwnerUser['owner']['cowPrice'];
  buffaloEnabled: CustomerOwnerWithOwnerUser['owner']['buffaloEnabled'];
  buffaloPrice: CustomerOwnerWithOwnerUser['owner']['buffaloPrice'];
  morningStart: CustomerOwnerWithOwnerUser['owner']['morningStart'];
  morningEnd: CustomerOwnerWithOwnerUser['owner']['morningEnd'];
  eveningStart: CustomerOwnerWithOwnerUser['owner']['eveningStart'];
  eveningEnd: CustomerOwnerWithOwnerUser['owner']['eveningEnd'];
  upiId: CustomerOwnerWithOwnerUser['owner']['upiId'];
  bankName: CustomerOwnerWithOwnerUser['owner']['bankName'];
  accountNumber: CustomerOwnerWithOwnerUser['owner']['accountNumber'];
  ifscCode: CustomerOwnerWithOwnerUser['owner']['ifscCode'];
};

export type GetUserResponse = UserWithSettings & {
  currentActiveOwner: CurrentActiveOwner | null;
};

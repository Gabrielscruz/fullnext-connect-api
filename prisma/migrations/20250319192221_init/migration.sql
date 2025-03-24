-- CreateTable
CREATE TABLE "public"."translate" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "translate" TEXT NOT NULL,

    CONSTRAINT "translate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tenant" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "channels" JSONB NOT NULL,
    "industries" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "trialEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationStyle" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "css" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "customerId" TEXT,
    "priceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" SERIAL NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "collectionMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profileUrl" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "firstAccess" BOOLEAN NOT NULL DEFAULT true,
    "dateOfBirth" DATE NOT NULL,
    "about" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessControlId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Module" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "defaultIcon" TEXT NOT NULL,
    "activeIcon" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PowerBiCredential" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAtUserId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedAtUserId" INTEGER,

    CONSTRAINT "PowerBiCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuLinkType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MenuLinkType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuLink" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "defaultIcon" TEXT NOT NULL,
    "activeIcon" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL DEFAULT 1,
    "powerBiCredentialId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MenuLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessControl" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AccessControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feedback" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAtUserId" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessControlLink" (
    "id" SERIAL NOT NULL,
    "accessControlId" INTEGER NOT NULL,
    "menuLinkId" INTEGER NOT NULL,

    CONSTRAINT "AccessControlLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteLink" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "menuLinkId" INTEGER NOT NULL,
    "query" TEXT NOT NULL,
    "favoritedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecentAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "menuLinkId" INTEGER NOT NULL,
    "query" TEXT NOT NULL,
    "favoritedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserLinkUsage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "menuLinkId" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "UserLinkUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Filter" (
    "id" SERIAL NOT NULL,
    "menuLinkId" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "public"."Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_ownerEmail_key" ON "public"."Organization"("ownerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerId_key" ON "public"."Customer"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "public"."Subscription"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."OrganizationStyle" ADD CONSTRAINT "OrganizationStyle_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_accessControlId_fkey" FOREIGN KEY ("accessControlId") REFERENCES "public"."AccessControl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuLink" ADD CONSTRAINT "MenuLink_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuLink" ADD CONSTRAINT "MenuLink_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."MenuLinkType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuLink" ADD CONSTRAINT "MenuLink_powerBiCredentialId_fkey" FOREIGN KEY ("powerBiCredentialId") REFERENCES "public"."PowerBiCredential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessControlLink" ADD CONSTRAINT "AccessControlLink_accessControlId_fkey" FOREIGN KEY ("accessControlId") REFERENCES "public"."AccessControl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessControlLink" ADD CONSTRAINT "AccessControlLink_menuLinkId_fkey" FOREIGN KEY ("menuLinkId") REFERENCES "public"."MenuLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteLink" ADD CONSTRAINT "FavoriteLink_menuLinkId_fkey" FOREIGN KEY ("menuLinkId") REFERENCES "public"."MenuLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteLink" ADD CONSTRAINT "FavoriteLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecentAccess" ADD CONSTRAINT "RecentAccess_menuLinkId_fkey" FOREIGN KEY ("menuLinkId") REFERENCES "public"."MenuLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecentAccess" ADD CONSTRAINT "RecentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Filter" ADD CONSTRAINT "Filter_menuLinkId_fkey" FOREIGN KEY ("menuLinkId") REFERENCES "public"."MenuLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

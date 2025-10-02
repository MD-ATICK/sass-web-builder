-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('AGENCY_OWNER', 'AGENCY_ADMIN', 'CLIENT_USER', 'CLIENT_QUEST');

-- CreateEnum
CREATE TYPE "public"."Icon" AS ENUM ('settings', 'chart', 'calendar', 'check', 'chip', 'compass', 'database', 'flag', 'home', 'info', 'link', 'lock', 'messages', 'notification', 'payment', 'power', 'receipt', 'shield', 'star', 'tune', 'videorecorder', 'wallet', 'warning', 'headphone', 'send', 'pipelines', 'person', 'category', 'contact', 'clipboardIcon');

-- CreateEnum
CREATE TYPE "public"."TagColor" AS ENUM ('BLUE', 'PURPLE');

-- CreateEnum
CREATE TYPE "public"."TriggerTypes" AS ENUM ('CONTACT_FORM');

-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('CREATE_CONTACT');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('ACCEPTED', 'REVOKED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."Plan" AS ENUM ('price_1SCv0kFb2EqqiFBeDjl4G0nE', 'price_1SCv0kFb2EqqiFBeab4Bh7LC');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'CLIENT_USER',
    "agencyId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permissions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "access" BOOLEAN NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agency" (
    "id" TEXT NOT NULL,
    "connectAccountId" TEXT DEFAULT '',
    "customerId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "agencyLogo" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "whiteLabel" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."client" (
    "id" TEXT NOT NULL,
    "connectAccountId" TEXT DEFAULT '',
    "name" TEXT NOT NULL,
    "clientLogo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 5,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" "public"."TagColor" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pipeline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lane" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Lane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "laneId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "value" INTEGER,
    "description" TEXT,
    "customerId" TEXT,
    "assignedUserId" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."TriggerTypes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Automation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "triggerId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AutomationInstance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "automationId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AutomationInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Action" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ActionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "automationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "laneId" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Funnel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "subDomainName" TEXT,
    "favicon" TEXT,
    "clientId" TEXT NOT NULL,
    "liveProducts" TEXT DEFAULT '[]',

    CONSTRAINT "Funnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClassName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "funnelId" TEXT NOT NULL,
    "customData" TEXT,

    CONSTRAINT "ClassName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunnelPage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pathName" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "order" INTEGER NOT NULL,
    "previewImage" TEXT,
    "funnelId" TEXT NOT NULL,

    CONSTRAINT "FunnelPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgencySidebarOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Menu',
    "link" TEXT NOT NULL DEFAULT '#',
    "icon" "public"."Icon" NOT NULL DEFAULT 'info',
    "agencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencySidebarOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientSidebarOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Menu',
    "link" TEXT NOT NULL DEFAULT '#',
    "icon" "public"."Icon" NOT NULL DEFAULT 'info',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT,

    CONSTRAINT "clientSidebarOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "role" "public"."Role" NOT NULL DEFAULT 'CLIENT_USER',

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "notification" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "clientId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "plan" "public"."Plan",
    "price" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "priceId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "currentPeriodEndDate" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "agencyId" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AddOns" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "priceId" TEXT NOT NULL,
    "agencyId" TEXT,

    CONSTRAINT "AddOns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TagToTicket" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagToTicket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_agencyId_idx" ON "public"."User"("agencyId");

-- CreateIndex
CREATE INDEX "Permissions_clientId_idx" ON "public"."Permissions"("clientId");

-- CreateIndex
CREATE INDEX "Permissions_email_idx" ON "public"."Permissions"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_customerId_key" ON "public"."Agency"("customerId");

-- CreateIndex
CREATE INDEX "client_agencyId_idx" ON "public"."client"("agencyId");

-- CreateIndex
CREATE INDEX "Tag_clientId_idx" ON "public"."Tag"("clientId");

-- CreateIndex
CREATE INDEX "Pipeline_clientId_idx" ON "public"."Pipeline"("clientId");

-- CreateIndex
CREATE INDEX "Lane_pipelineId_idx" ON "public"."Lane"("pipelineId");

-- CreateIndex
CREATE INDEX "Ticket_laneId_idx" ON "public"."Ticket"("laneId");

-- CreateIndex
CREATE INDEX "Ticket_customerId_idx" ON "public"."Ticket"("customerId");

-- CreateIndex
CREATE INDEX "Ticket_assignedUserId_idx" ON "public"."Ticket"("assignedUserId");

-- CreateIndex
CREATE INDEX "Trigger_clientId_idx" ON "public"."Trigger"("clientId");

-- CreateIndex
CREATE INDEX "Automation_triggerId_idx" ON "public"."Automation"("triggerId");

-- CreateIndex
CREATE INDEX "Automation_clientId_idx" ON "public"."Automation"("clientId");

-- CreateIndex
CREATE INDEX "AutomationInstance_automationId_idx" ON "public"."AutomationInstance"("automationId");

-- CreateIndex
CREATE INDEX "Action_automationId_idx" ON "public"."Action"("automationId");

-- CreateIndex
CREATE INDEX "Contact_clientId_idx" ON "public"."Contact"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_link_key" ON "public"."Media"("link");

-- CreateIndex
CREATE INDEX "Media_clientId_idx" ON "public"."Media"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Funnel_subDomainName_key" ON "public"."Funnel"("subDomainName");

-- CreateIndex
CREATE INDEX "Funnel_clientId_idx" ON "public"."Funnel"("clientId");

-- CreateIndex
CREATE INDEX "ClassName_funnelId_idx" ON "public"."ClassName"("funnelId");

-- CreateIndex
CREATE INDEX "FunnelPage_funnelId_idx" ON "public"."FunnelPage"("funnelId");

-- CreateIndex
CREATE INDEX "AgencySidebarOption_agencyId_idx" ON "public"."AgencySidebarOption"("agencyId");

-- CreateIndex
CREATE INDEX "clientSidebarOption_clientId_idx" ON "public"."clientSidebarOption"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_email_key" ON "public"."Invitation"("email");

-- CreateIndex
CREATE INDEX "Invitation_agencyId_idx" ON "public"."Invitation"("agencyId");

-- CreateIndex
CREATE INDEX "Notification_agencyId_idx" ON "public"."Notification"("agencyId");

-- CreateIndex
CREATE INDEX "Notification_clientId_idx" ON "public"."Notification"("clientId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "public"."Subscription"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_agencyId_key" ON "public"."Subscription"("agencyId");

-- CreateIndex
CREATE INDEX "Subscription_customerId_idx" ON "public"."Subscription"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "AddOns_priceId_key" ON "public"."AddOns"("priceId");

-- CreateIndex
CREATE INDEX "AddOns_agencyId_idx" ON "public"."AddOns"("agencyId");

-- CreateIndex
CREATE INDEX "_TagToTicket_B_index" ON "public"."_TagToTicket"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permissions" ADD CONSTRAINT "Permissions_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permissions" ADD CONSTRAINT "Permissions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client" ADD CONSTRAINT "client_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pipeline" ADD CONSTRAINT "Pipeline_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lane" ADD CONSTRAINT "Lane_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "public"."Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_laneId_fkey" FOREIGN KEY ("laneId") REFERENCES "public"."Lane"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trigger" ADD CONSTRAINT "Trigger_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Automation" ADD CONSTRAINT "Automation_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "public"."Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Automation" ADD CONSTRAINT "Automation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AutomationInstance" ADD CONSTRAINT "AutomationInstance_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "public"."Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Action" ADD CONSTRAINT "Action_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "public"."Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Funnel" ADD CONSTRAINT "Funnel_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassName" ADD CONSTRAINT "ClassName_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "public"."Funnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FunnelPage" ADD CONSTRAINT "FunnelPage_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "public"."Funnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgencySidebarOption" ADD CONSTRAINT "AgencySidebarOption_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientSidebarOption" ADD CONSTRAINT "clientSidebarOption_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AddOns" ADD CONSTRAINT "AddOns_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TagToTicket" ADD CONSTRAINT "_TagToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TagToTicket" ADD CONSTRAINT "_TagToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

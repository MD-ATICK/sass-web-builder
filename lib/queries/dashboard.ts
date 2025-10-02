"use server";

import { stripe } from "@/stripe";
import { prisma } from "../db";
import { Agency, client } from "@prisma/client";
import Stripe from "stripe";

type ReturnType =
	| {
			notHaveConnectAccountId?: boolean;
			error: string;
	  }
	| {
			clients: client[];
			netIncome: number;
			pendingIncome: number;
			succeedRate: string;
			currentYear: number;
			activeClients: number;
			agency: Agency;
			succeedSessions: Stripe.Checkout.Session[];
			pendingSessions: Stripe.Checkout.Session[];
	  };

export const getAgencyDashboardData = async (
	agencyId: string,
): Promise<ReturnType> => {
	const agency = await prisma.agency.findUnique({
		where: { id: agencyId },
		include: { clients: true },
	});
	if (!agency) return { error: "Agency not found" };

	const clients = agency.clients;
	if (!agency.connectAccountId)
		return {
			error: "Connect account id not found",
			notHaveConnectAccountId: true,
		};

	const currentYear = new Date().getFullYear();
	const startDate =
		new Date(`${currentYear}-01-01T00:00:00.000Z`).getTime() / 1000;
	const endDate =
		new Date(`${currentYear}-12-31T23:59:59.000Z`).getTime() / 1000;

	const { data: sessions } = await stripe.checkout.sessions.list(
		{
			limit: 100,
			created: { gte: startDate, lte: endDate },
		},
		{ stripeAccount: agency.connectAccountId },
	);

	const succeedSessions = sessions.filter(
		session => session.status === "complete",
	);
	const pendingSessions = sessions.filter(session => session.status === "open");

	const netIncome = succeedSessions.reduce((acc, session) => {
		return acc + (session.amount_total || 0) / 100;
	}, 0);

	const pendingIncome = pendingSessions.reduce((acc, session) => {
		return acc + (session.amount_total || 0) / 100;
	}, 0);

	const succeedRate = (
		(succeedSessions.length / sessions.length) *
		100
	).toFixed();

	return {
		clients,
		netIncome,
		pendingIncome,
		succeedRate,
		currentYear,
		activeClients: clients.length,
		agency,
		pendingSessions,
		succeedSessions,
	};
};

type ClientReturnType =
	| {
			notHaveConnectAccountId?: boolean;
			error: string;
	  }
	| {
			netIncome: number;
			pendingIncome: number;
			succeedRate: string;
			currentYear: number;
			funnelsCount: number;
			pipeLinesCount: number;
			client: client;
			succeedSessions: Stripe.Checkout.Session[];
			pendingSessions: Stripe.Checkout.Session[];
	  };

export const getClientDashboardData = async (
	clientId: string,
): Promise<ClientReturnType> => {
	const client = await prisma.client.findUnique({
		where: { id: clientId },
		include: { Funnels: true, Pipeline: true },
	});
	if (!client) return { error: "Agency not found" };

	if (!client.connectAccountId)
		return {
			error: "Connect account id not found",
			notHaveConnectAccountId: true,
		};

	const currentYear = new Date().getFullYear();
	const startDate =
		new Date(`${currentYear}-01-01T00:00:00.000Z`).getTime() / 1000;
	const endDate =
		new Date(`${currentYear}-12-31T23:59:59.000Z`).getTime() / 1000;

	const { data: sessions } = await stripe.checkout.sessions.list(
		{
			limit: 100,
			created: { gte: startDate, lte: endDate },
		},
		{ stripeAccount: client.connectAccountId },
	);

	const succeedSessions = sessions.filter(
		session => session.status === "complete",
	);
	const pendingSessions = sessions.filter(session => session.status === "open");

	const netIncome = succeedSessions.reduce((acc, session) => {
		return acc + (session.amount_total || 0) / 100;
	}, 0);

	const pendingIncome = pendingSessions.reduce((acc, session) => {
		return acc + (session.amount_total || 0) / 100;
	}, 0);

	const succeedRate = (
		(succeedSessions.length / sessions.length) *
		100
	).toFixed();

	return {
		netIncome,
		pendingIncome,
		succeedRate,
		currentYear,
		funnelsCount: client.Funnels.length,
		pipeLinesCount: client.Pipeline.length,
		client,
		pendingSessions,
		succeedSessions,
	};
};

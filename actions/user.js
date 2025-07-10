"use server";

import { PrismaClient } from "@/lib/generated/prisma";
const prisma = new PrismaClient();

import { auth, currentUser } from "@clerk/nextjs/server";

// Create a new user
export async function createUser() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const user = await currentUser();
    if (!user) throw new Error("User not found");

    const email = user.emailAddresses?.[0]?.emailAddress || "";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    if (!firstName || !email) {
      throw new Error("Missing required user information");
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (existing) return {
        success: true,
        user: existing,
        message: "User already exists"
    };

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email,
        firstName,
        lastName,
      },
    });

    return {
        success: true,
        user: newUser,
        message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {success: false, error: error.message || "Failed to create user"};
  }
}

// Get all applications for a user
export async function getUserApplications() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { appliedDate: "desc" },
    });

    return {
        success: true,
        applications,
        message: "Applications fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching applications:", error);
    return { success: false, error: error.message || "Failed to fetch applications" };
  }
}
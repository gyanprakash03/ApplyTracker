"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();

// Create a new application
export async function createApplication(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Attach the authenticated user's ID to the application
    const newApp = await prisma.application.create({
      data: {
        ...data,
        appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString() : undefined,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
        userId,
      },
    });

    return {
      success: true,
      application: newApp,
      message: "Application created successfully",
    };
  } catch (error) {
    console.error("Error creating application:", error);
    return {
      success: false,
      error: error.message || "Failed to create application",
    };
  }
}

// Delete an application by ID
export async function deleteApplication(applicationId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Ensure the application belongs to the authenticated user
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      throw new Error("Application not found");
    } else if (app.userId !== userId) {
      throw new Error("Unathorized action");
    }

    await prisma.application.delete({
      where: { id: applicationId },
    });

    return {
      success: true,
      message: "Application deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting application:", error);
    return {
      success: false,
      error: error.message || "Failed to delete application",
    };
  }
}

// Update an existing application by ID
export async function editApplication(applicationId, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Ensure the application belongs to the authenticated user
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      throw new Error("Application not found");
    } else if (app.userId !== userId) {
      throw new Error("Unauthorized action");
    }

    const updateData = {
      ...data,
      appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString() : undefined,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
    };

    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: updateData,
    });

    return {
      success: true,
      application: updatedApp,
      message: "Application updated successfully",
    };
  } catch (error) {
    console.error("Error editing application:", error);
    return {
      success: false,
      error: error.message || "Failed to edit application",
    };
  }
}

// get applications by filter
export async function getApplicationsByFilter({ status, jobType }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Build dynamic filter
    const where = { userId };
    if (status && status !== "any") where.status = status;
    if (jobType && jobType !== "any") where.jobType = jobType;

    const applications = await prisma.application.findMany({
      where,
      orderBy: { appliedDate: "desc" },
    });

    return {
      success: true,
      applications,
      message: "Filtered applications successfully",
    };
  } catch (error) {
    console.error("Error fetching filtered applications:", error);
    return {
      success: false,
      error: error.message || "Failed to filter applications",
    };
  }
}
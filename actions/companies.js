"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getCompanyInfo(companies) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `For each company in this list: ${companies.join(", ")}
                Return an array of JSON objects with:
                - name (original company name)
                - about (1 sentence about the company)
                - careerUrl (official career page URL, must be a valid https link)
                - linkedinUrl (official LinkedIn page, must be a valid https link)
                - country (country of origin)
                If you cannot find a field, write "" for country, and skip the company if you cannot find both URLs.
                Example:
                [
                {
                    "name": "Google",
                    "about": "...",
                    "careerUrl": "https://careers.google.com",
                    "linkedinUrl": "https://www.linkedin.com/company/google",
                    "country": "USA"
                }
                ]
                Rules:
                1. Only return valid JSON parsable with JSON.parse()
                2. Only include companies where both URLs are present.
                3. Prefer .in domains for Indian companies.
                `
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              about: { type: "string" },
              careerUrl: { type: "string" },
              linkedinUrl: { type: "string" },
              country: { type: "string" },
            },
            required: ["name", "about", "careerUrl", "linkedinUrl", "country"],
          },
        },
      },
    });

    const response = result.text;
    return JSON.parse(response);
  } catch (e) {
    console.error("Failed to get info from gemini or parse text", e);
    return [];
  }
}

// Add multiple companies (max 10)
export async function addCompanies(companies) {
  try {
    if (companies.length === 0) throw new error("No companies provided.");

    if (companies.length > 10)
      throw new Error("Only 10 companies can be added at once.");

    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const data = await getCompanyInfo(companies);
    if (data.length === 0) {
      throw new Error("Couldn't fetch company data from Gemini.");
    }

    const companiesWithUserId = data.map((company) => ({
      ...company,
      userId,
    }));

    const created = await prisma.company.createMany({
      data: companiesWithUserId,
      skipDuplicates: true,
    });

    const newCompanies = await prisma.company.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      newCompanies,
      message: `${created.count} companies added successfully.`,
    };
  } catch (error) {
    console.error("Error adding companies:", error);
    return {
      success: false,
      error: error.message || "Failed to add companies.",
    };
  }
}

// Delete a company by ID
export async function deleteCompany(companyId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Ensure the company belongs to the user
    // const company = await prisma.company.findUnique({
    //     where: { id: companyId }
    // });
    // if (!company || company.userId !== userId) {
    //   return { success: false, error: "Company not found or unauthorized." };
    // }
    await prisma.company.delete({
      where: { id: companyId },
    });
    return {
      success: true,
      message: "Company deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting company:", error);
    return {
      success: false,
      error: error.message || "Failed to delete company.",
    };
  }
}

// Get all companies for a user
export async function getUserCompanies() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const companies = await prisma.company.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      companies,
      message: "Companies fetched successfully.",
    };
  } catch (error) {
    console.error("Error fetching companies:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch companies.",
    };
  }
}

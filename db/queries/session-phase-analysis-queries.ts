"use server";

import { db } from "@/db/db";
import { eq, desc } from "drizzle-orm";
import { InsertSessionPhaseAnalysis, sessionPhaseAnalysisTable, SelectSessionPhaseAnalysis } from "../schema";

export const createSessionPhaseAnalysis = async (data: InsertSessionPhaseAnalysis) => {
  try {
    const [newAnalysis] = await db.insert(sessionPhaseAnalysisTable).values(data).returning();
    return newAnalysis;
  } catch (error) {
    console.error("Error creating session phase analysis:", error);
    throw new Error("Failed to create session phase analysis");
  }
};

export const getSessionPhaseAnalysisBySessionId = async (sessionId: string) => {
  try {
    const analysis = await db.query.sessionPhaseAnalysis.findFirst({
      where: eq(sessionPhaseAnalysisTable.sessionId, sessionId)
    });
    return analysis;
  } catch (error) {
    console.error("Error getting session phase analysis:", error);
    throw new Error("Failed to get session phase analysis");
  }
};

export const getAllSessionPhaseAnalyses = async (): Promise<SelectSessionPhaseAnalysis[]> => {
  try {
    const analyses = await db.select()
      .from(sessionPhaseAnalysisTable)
      .orderBy(desc(sessionPhaseAnalysisTable.createdAt));
    
    return analyses;
  } catch (error) {
    console.error("Error getting all session phase analyses:", error);
    throw new Error("Failed to get session phase analyses");
  }
};

export const getSessionPhaseAnalysisDetails = async (id: number) => {
  try {
    const analysis = await db.query.sessionPhaseAnalysis.findFirst({
      where: eq(sessionPhaseAnalysisTable.id, id),
      columns: {
        authPhaseDetails: true,
        selectionPhaseDetails: true,
        initiationPhaseDetails: true,
        userExperienceIssues: true
      }
    });
    return analysis;
  } catch (error) {
    console.error("Error getting session phase analysis details:", error);
    throw new Error("Failed to get session phase analysis details");
  }
}; 
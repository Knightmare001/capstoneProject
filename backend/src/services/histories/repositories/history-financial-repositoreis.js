import { query } from "../../../lib/db.js";
import { nanoid } from "nanoid";

const FinancialHistoryRepository = {
  async createFinancialAnalysis(data) {
    const id = `fin-${nanoid(16)}`;
    const text = `
      INSERT INTO histories_financial (
        id, career_history_id, monthly_savings, monthly_expenses, monthly_debt_obligations,
        has_dependents, has_health_insurance, job_prospect_status, has_side_hustle,
        workplace_stress_score, final_readiness_score
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING id, career_history_id, final_readiness_score, created_at;
    `;

    const values = [
      id,
      data.historyId,
      data.monthlySavings,
      data.monthlyExpenses,
      data.monthlyDebtObligations || 0,
      data.hasDependents,
      data.hasHealthInsurance || false,
      data.jobProspectStatus || "NO_LEADS",
      data.hasSideHustle || false,
      data.workplaceStressScore,
      data.finalReadinessScore,
    ];

    const { rows } = await query(text, values);
    return rows[0];
  },

  async findById(id) {
    const text = `
      SELECT * FROM histories_financial
      WHERE id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await query(text, [id]);

    return rows[0];
  },

  async findByCareerId(careerId) {
    const text = `
      SELECT * FROM histories_financial
      WHERE career_history_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await query(text, [careerId]);

    // Mengembalikan 1 baris data (karena hubungannya 1:1)
    return rows[0];
  },

  async findByUserId(userId) {
    const text = `
      SELECT f.* FROM histories_financial f
      INNER JOIN histories_career c ON f.career_history_id = c.id
      WHERE c.user_id = $1
      ORDER BY f.created_at DESC;
    `;
    const { rows } = await query(text, [userId]);

    return rows;
  },
};

export default FinancialHistoryRepository;

import { query } from "../../../lib/db.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const CareerHistoryRepository = {
  async createHistory(data) {
    const id = `predict-${nanoid(16)}`;
    const text = `
      INSERT INTO histories_career (
        id, user_id, score, risk_level,
        monthly_income, job_role, over_time, distance_from_home,
        total_working_years, num_companies_worked, years_at_company,
        years_in_current_role, years_since_last_promotion, job_satisfaction,
        work_life_balance, stagnation_index, burnout_flag,
        years_per_company, overall_satisfaction, environment_satisfaction
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      )
      RETURNING id, score, risk_level, created_at;
    `;

    const values = [
      id,
      data.userId,
      data.score,
      data.riskLevel,
      data.monthlyIncome,
      data.jobRole,
      data.overTime,
      data.distanceFromHome,
      data.totalWorkingYears,
      data.numCompaniesWorked,
      data.yearsAtCompany,
      data.yearsInCurrentRole,
      data.yearsSinceLastPromotion,
      data.jobSatisfaction,
      data.workLifeBalance,
      data.stagnationIndex,
      data.burnoutFlag,
      data.yearsPerCompany,
      data.overallSatisfaction,
      data.environmentSatisfaction,
    ];

    const { rows } = await query(text, values);
    return rows[0];
  },

  async findByUserId(userId) {
    const text = `
      SELECT * FROM histories_career
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await query(text, [userId]);

    // membersihkan kolom data apa saja yang mau diberikan kepada user
    const filteredRows = rows.map((row) => {
      const { years_per_company, overall_satisfaction, ...cleanData } = row;

      return cleanData;
    });

    return filteredRows;
  },

  async findById(id, owner) {
    const text = `
      SELECT * FROM histories_career
      WHERE id = $1 AND user_id = $2
      ORDER BY created_at DESC;
    `;
    const { rows } = await query(text, [id, owner]);

    if (rows.length === 0) {
      return null;
    }

    // membersihkan kolom data apa saja yang mau diberikan kepada user
    const { years_per_company, overall_satisfaction, ...cleanData } = rows[0];

    return cleanData;
  },
};

export default CareerHistoryRepository;

import { query } from "../../../lib/db.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const HistoryRepository = {
  async createHistory(data) {
    const id = `predict-${nanoid(16)}`;
    const text = `
      INSERT INTO histories (
        id, user_id, score, is_potential_resign, suggestion,
        monthly_income, job_role, over_time, distance_from_home,
        total_working_years, num_companies_worked, years_at_company,
        years_in_current_role, years_since_last_promotion, job_satisfaction,
        work_life_balance, stagnation_index, burnout_flag,
        years_per_company, overall_satisfaction, environment_satisfaction
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      )
      RETURNING id, score, is_potential_resign AS "isPotentialResign", created_at;
    `;

    const values = [
      id,
      data.userId,
      data.score,
      data.isPotentialResign,
      data.suggestion,
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
      SELECT * FROM histories
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await query(text, [userId]);
    return rows;
  },
};

export default HistoryRepository;

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("histories_financial", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    career_history_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"histories_career"', // Menghubungkan ke tabel histories lama
      onDelete: "CASCADE", // Jika data history dihapus, data finansial ini otomatis terhapus
      unique: true, // Memastikan hubungan One-to-One (1 history hanya punya 1 analisis finansial)
    },
    monthly_savings: {
      type: "NUMERIC(12, 2)",
      notNull: true,
    },
    monthly_expenses: {
      type: "NUMERIC(12, 2)",
      notNull: true,
    },
    monthly_debt_obligations: {
      type: "NUMERIC(12, 2)",
      notNull: true,
      default: 0,
    },
    has_dependents: {
      type: "VARCHAR(5)", // Menyimpan nilai "Yes" atau "No"
      notNull: true,
    },
    has_health_insurance: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
    job_prospect_status: {
      type: "VARCHAR(20)", // NO_LEADS, APPLIED_ONLY, INTERVIEW_STAGE, SIGNED_OFFER
      notNull: true,
      default: "NO_LEADS",
    },
    has_side_hustle: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
    workplace_stress_score: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    final_readiness_score: {
      type: "INTEGER",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("histories_financial");
};

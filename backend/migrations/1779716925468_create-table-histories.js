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
  pgm.createTable("histories", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"', // Menghubungkan ke tabel users
      onDelete: "CASCADE", // Jika user dihapus, riwayatnya ikut terhapus
    },

    // AI prediction
    score: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    is_potential_resign: {
      type: "BOOLEAN",
      notNull: true,
    },
    suggestion: {
      type: "TEXT",
      notNull: true,
    },

    // input from user
    monthly_income: {
      type: "NUMERIC(10, 2)",
      notNull: true,
    },
    job_role: {
      type: "INTEGER",
      notNull: true,
    },
    over_time: {
      type: "INTEGER",
      notNull: true,
    },
    distance_from_home: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    total_working_years: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    num_companies_worked: {
      type: "INTEGER",
      notNull: true,
    },
    years_at_company: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    years_in_current_role: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    years_since_last_promotion: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    job_satisfaction: {
      type: "INTEGER",
      notNull: true,
    },
    work_life_balance: {
      type: "INTEGER",
      notNull: true,
    },
    stagnation_index: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    burnout_flag: {
      type: "INTEGER",
      notNull: true,
    },
    years_per_company: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    overall_satisfaction: {
      type: "NUMERIC(5, 2)",
      notNull: true,
    },
    environment_satisfaction: {
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
  pgm.dropTable("histories");
};

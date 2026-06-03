import fs from "fs";
import path from "path";
import csv from "csv-parser";
import response from "../../../utils/response.js";

export const getCompetencyRecommendation = async (req, res) => {
  try {
    const { minExpectedSalary, maxExpectedSalary, userSkills } = req.validated;

    // Konversi range IDR ke USD (kurs 1 USD = Rp16.500)
    const IDR_TO_USD_KURS = 16000;
    const minSalaryUSD = minExpectedSalary / IDR_TO_USD_KURS;
    const maxSalaryUSD = maxExpectedSalary / IDR_TO_USD_KURS;
    const midSalaryUSD = (minSalaryUSD + maxSalaryUSD) / 2;

    const skillDictionary = {
      ACCT: "Accounting",
      ADM: "Administrative",
      ADV: "Advertising",
      ADVR: "Advertising",
      ANLT: "Analyst",
      ART: "Art/Creative",
      BD: "Business Development",
      CHEF: "Chefs/Cooks",
      "CO CONSULT": "Consulting",
      CS: "Customer Service",
      CUST: "Customer Support/Service",
      DSGN: "Design",
      EDU: "Education",
      ENG: "Engineering",
      FIN: "Finance",
      GEN: "General Business",
      GENB: "General Business",
      HCPR: "Healthcare Practice",
      HR: "Human Resources",
      IT: "Information Technology",
      LAW: "Legal",
      LGL: "Legal",
      MGMT: "Management",
      MNFC: "Manufacturing",
      MRKT: "Marketing",
      PR: "Public Relations",
      PROD: "Production",
      PRCH: "Purchasing",
      PRJM: "Project Management",
      QA: "Quality Assurance",
      RE: "Real Estate",
      RSCH: "Research",
      SALE: "Sales",
      SCI: "Science",
      STRG: "Strategy/Planning",
      SUPL: "Supply Chain",
      TRAI: "Training",
      TRNG: "Training",
      WRT: "Writing/Editing",
    };

    const csvFilePath = path.resolve("data/linkedin-Job-Postings.csv");
    const allValidJobs = [];

    // Baca CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv({ separator: ";" }))
        .on("data", (row) => {
          const normalizedSalary = row.normalized_salary ? Number(row.normalized_salary) : 0;
          const maxSalary = row.max_salary ? Number(row.max_salary) : 0;
          const minSalary = row.min_salary ? Number(row.min_salary) : 0;
          const jobSalary = normalizedSalary || maxSalary || minSalary;

          if (jobSalary > 0 && row.skill_readable) {
            allValidJobs.push({
              salary: jobSalary,
              skills: row.skill_readable,
              listed_time: row.listed_time,
            });
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (allValidJobs.length === 0) {
      return response(res, 200, "Tidak ada data pasar yang valid.", null);
    }

    // Filter langsung pakai range salary dari user (minSalaryUSD - maxSalaryUSD)
    //    Ini lebih presisi karena pakai batas eksplisit dari input user
    let marketSamples = allValidJobs.filter((job) => job.salary >= minSalaryUSD && job.salary <= maxSalaryUSD);

    // Fallback: jika data dalam range terlalu sedikit,
    // perlebar sedikit ke ±20% dari titik tengah range
    if (marketSamples.length < 10) {
      const FALLBACK_TOLERANCE = 0.2;
      marketSamples = allValidJobs.filter(
        (job) =>
          job.salary >= midSalaryUSD * (1 - FALLBACK_TOLERANCE) &&
          job.salary <= midSalaryUSD * (1 + FALLBACK_TOLERANCE),
      );
    }

    // Fallback terakhir: ambil 20 job paling dekat dengan titik tengah range
    if (marketSamples.length < 5) {
      marketSamples = allValidJobs
        .map((job) => ({ ...job, distance: Math.abs(job.salary - midSalaryUSD) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20);
    }

    //Normalisasi userSkills ke lowercase
    const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());

    //Hitung semua skill unik yang dibutuhkan pasar dari sampel
    const allMarketSkills = new Set();
    marketSamples.forEach((job) => {
      job.skills
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .forEach((code) => {
          if (code && code !== "OTHR") {
            const readable = skillDictionary[code] || code;
            allMarketSkills.add(readable);
          }
        });
    });

    //Hitung berapa skill user yang ditemukan di market sample
    const matchedSkills = userSkills.filter((userSkill) =>
      [...allMarketSkills].some((marketSkill) => marketSkill.toLowerCase() === userSkill.toLowerCase().trim()),
    );

    //Match percentage: skill user yang ada di pasar / total skill yang user input
    const matchPercentage = userSkills.length > 0 ? Math.round((matchedSkills.length / userSkills.length) * 100) : 0;

    //Hitung skill gap dan tren bulan hiring
    const marketSkillCounts = {};
    const monthlyHiringCounts = Array(12).fill(0);

    marketSamples.forEach((job) => {
      const jobSkills = job.skills
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      let hasUserOwnedSkillInThisJob = false;

      jobSkills.forEach((cleanSkillCode) => {
        if (cleanSkillCode === "OTHR") return;

        const readableSkillName = skillDictionary[cleanSkillCode] || cleanSkillCode;
        const hasSkill = normalizedUserSkills.some(
          (userSkill) => userSkill === readableSkillName.toLowerCase() || userSkill === cleanSkillCode.toLowerCase(),
        );

        if (!hasSkill) {
          marketSkillCounts[readableSkillName] = (marketSkillCounts[readableSkillName] || 0) + 1;
        } else {
          hasUserOwnedSkillInThisJob = true;
        }
      });

      // Tren hiring hanya untuk job yang relevan dengan skill user
      if (hasUserOwnedSkillInThisJob && job.listed_time) {
        const cleanTime = String(job.listed_time).replace(/,/g, ".");
        const date = new Date(Number(cleanTime));
        if (!isNaN(date.getTime())) {
          monthlyHiringCounts[date.getMonth()]++;
        }
      }
    });

    // Ambil top skill gap dengan shuffle untuk variasi output
    const sortedSkills = Object.entries(marketSkillCounts).sort((a, b) => b[1] - a[1]);
    const threshold = sortedSkills[4]?.[1] ?? 0;
    const candidatePool = sortedSkills.filter(([, count]) => count >= threshold);
    const shuffled = candidatePool.sort(() => Math.random() - 0.5);
    const topSkillsToLearn = shuffled.slice(0, 3).map(([skill]) => skill);

    // Hitung bulan terbaik untuk melamar
    const maxVal = Math.max(...monthlyHiringCounts);
    const maxHiringIndex = maxVal > 0 ? monthlyHiringCounts.indexOf(maxVal) : new Date().getMonth();

    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const bestMonthToApply = monthNames[maxHiringIndex];

    // Susun narasi rekomendasi
    let adviceText = `Berdasarkan rentang gaji yang Anda targetkan (Rp${minExpectedSalary.toLocaleString("id-ID")} – Rp${maxExpectedSalary.toLocaleString("id-ID")}), tingkat kecocokan kompetensi Anda saat ini adalah ${matchPercentage}%. `;
    if (topSkillsToLearn.length > 0) {
      adviceText += `Untuk bersaing di level kompensasi ini, disarankan memperkuat keahlian di bidang: ${topSkillsToLearn.join(", ")}.`;
    } else {
      adviceText += `Luar biasa! Profil kompetensi Anda sudah memenuhi standar ekspektasi pasar industri saat ini.`;
    }

    // Kirim response
    return response(res, 200, "Analisis kompetensi pasar sukses", {
      salaryExpectationIDR: {
        min: minExpectedSalary,
        max: maxExpectedSalary,
      },
      salaryExpectationUSD: {
        min: Math.round(minSalaryUSD),
        max: Math.round(maxSalaryUSD),
      },
      skillMatchPercentage: matchPercentage,
      recommendedSkillsToLearn: topSkillsToLearn,
      bestHiringSeason: {
        recommendedMonth: bestMonthToApply,
        reason: `Berdasarkan rekam jejak histori lowongan, bulan ${bestMonthToApply} memiliki aktivitas perekrutan tertinggi untuk posisi-posisi yang sesuai kualifikasi Anda.`,
      },
      summaryAdvice: adviceText,
    });
  } catch (error) {
    console.error("Error in getCompetencyRecommendation:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};

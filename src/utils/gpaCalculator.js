const calculateSemesterGPA = (grades = []) => {
  const totalCredits = grades.reduce((sum, item) => sum + Number(item.credit_unit || 0), 0);
  const totalPoints = grades.reduce((sum, item) => sum + Number(item.grade_point || 0) * Number(item.credit_unit || 0), 0);
  if (!totalCredits) return 0;
  return Number((totalPoints / totalCredits).toFixed(2));
};

const calculateCGPA = (semesterResults = []) => {
  const totalCredits = semesterResults.reduce((sum, semester) => sum + Number(semester.credit_units || 0), 0);
  const totalPoints = semesterResults.reduce((sum, semester) => sum + Number(semester.grade_points || 0), 0);
  if (!totalCredits) return 0;
  return Number((totalPoints / totalCredits).toFixed(2));
};

module.exports = {
  calculateSemesterGPA,
  calculateCGPA,
};

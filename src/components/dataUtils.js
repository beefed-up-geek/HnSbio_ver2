// src/utils/dataUtils.js

export const parseDateString = dateString => {
  if (!dateString) return null;

  const [datePart, timePart] = dateString.trim().split(' ');
  const [year, month, day] = datePart.split(/[-/]/).map(Number);

  let hours = 0,
    minutes = 0,
    seconds = 0;
  if (timePart) {
    [hours, minutes, seconds] = timePart.split(':').map(Number);
  }

  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return isNaN(date.getTime()) ? null : date;
};

export const parseHealthCheckupDate = (year, dateString) => {
  const month = parseInt(dateString.substring(0, 2), 10) - 1; // Months are 0-based
  const day = parseInt(dateString.substring(2), 10);

  return new Date(parseInt(year, 10), month, day);
};

export const formatDate = date => {
  if (!(date instanceof Date) || isNaN(date)) {
    return '';
  }
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}.${month}.${day}`;
};

export const calculateAge = birthdate => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const calculateGFR = (creatinine, age, gender) => {
  const isFemale = gender === 'female';
  let gfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
  if (isFemale) {
    gfr *= 0.742;
  }
  return Math.round(gfr);
};

export const getLatestGFR = (parsedData, birthdate, gender) => {
  const combinedResults = [];

  // Process blood_test_result
  if (parsedData.blood_test_result && parsedData.blood_test_result.length > 0) {
    parsedData.blood_test_result.forEach(test => {
      if (test.date) {
        const date = parseDateString(test.date);
        if (date) {
          combinedResults.push({
            source: 'blood_test',
            date,
            data: test,
          });
        } else {
          console.warn(`Invalid date in blood_test_result: ${test.date}`);
        }
      } else {
        console.warn('Missing date in blood_test_result entry:', test);
      }
    });
  }

  // Process healthCheckup
  if (parsedData.healthCheckup && parsedData.healthCheckup.length > 0) {
    parsedData.healthCheckup.forEach(checkup => {
      const date = parseHealthCheckupDate(
        checkup.resCheckupYear,
        checkup.resCheckupDate,
      );
      if (date) {
        combinedResults.push({
          source: 'health_checkup',
          date,
          data: checkup,
        });
      } else {
        console.warn(
          `Invalid date in healthCheckup: ${checkup.resCheckupYear}-${checkup.resCheckupDate}`,
        );
      }
    });
  }

  // Find the most recent record
  if (combinedResults.length > 0) {
    combinedResults.sort((a, b) => b.date - a.date);
    const latestRecord = combinedResults[0];

    let latestGFR = null;
    let latestCheckupDate = formatDate(latestRecord.date);
    let latestRecordSource = latestRecord.source;

    if (latestRecord.source === 'blood_test') {
      const data = latestRecord.data;
      if (data.GFR) {
        latestGFR = data.GFR;
      } else if (data.creatinine) {
        const age = calculateAge(birthdate);
        latestGFR = calculateGFR(data.creatinine, age, gender);
      }
    } else if (latestRecord.source === 'health_checkup') {
      const data = latestRecord.data;
      const serumCreatinine = parseFloat(data.resSerumCreatinine);
      if (!isNaN(serumCreatinine) && serumCreatinine > 0) {
        if (data.resGFR) {
          latestGFR = parseFloat(data.resGFR);
        } else {
          const age = calculateAge(birthdate);
          latestGFR = calculateGFR(serumCreatinine, age, gender);
        }
      }
    }

    return { latestGFR, latestCheckupDate, latestRecordSource };
  } else {
    return { latestGFR: null, latestCheckupDate: null, latestRecordSource: '' };
  }
};

import { getDateDiffInMinutes } from "@/utils/Dates/getDateDiffs";

const getOnlyLast24hStats = stats => {
  const only24h = stats
    .filter(item => {
      if (item.datetime) {
        const diff = getDateDiffInMinutes(
          new Date(item.datetime).getTime(),
          Date.now()
        );
        return diff / 60 <= 24;
      }
    })
    .map(item => {
      const date = new Date(item.datetime);

      return Object.assign(item, {
        date: {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear()
        },
        time: {
          hour: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds()
        }
      });
    });

  console.log({ only24h });

  return only24h;
};

const groupStatsByHour = stats => {
  console.log("groupStatsByHour", stats);
  let statsByDayAndHour = [];
  let indexOfDaysAndHours = [];

  const groupBy = (day, hour) => {
    return stats.filter(
      item =>
        new Date(item.datetime).getDate() === day &&
        new Date(item.datetime).getHours() === hour
    );
  };

  let lastStatsHour = new Date(stats[stats.length - 1].datetime).getHours();
  let lastStatsDay = new Date(stats[stats.length - 1].datetime).getDate();

  const firstStatsHour = new Date(stats[0].datetime).getHours();
  const firstStatsDay = new Date(stats[0].datetime).getDate();

  for (let i = 0; i < 24; i++) {
    let day = lastStatsDay;
    let hour = lastStatsHour;

    lastStatsHour--;

    if (hour == 0) {
      lastStatsDay--;
      lastStatsHour = 23;
    }

    if (day === firstStatsDay && hour < firstStatsHour) continue;

    statsByDayAndHour[`${day}_${hour}`] = groupBy(day, hour);
    indexOfDaysAndHours.push(`${day}_${hour}`);
  }

  return { stats: statsByDayAndHour, index: indexOfDaysAndHours };
};

const getLabels = (statsGroupedByDayAndHour, index) => {
  return index.map(i => {
    return statsGroupedByDayAndHour[i][0].time.hour;
  });
};

const getAverage = (data, index, field) => {
  return index.map(i => {
    const itemGroup = data[i];
    let total = itemGroup
      .map(item => item[field])
      .reduce((acc, item) => acc + item, 0);

    const average = total / itemGroup.length;
    console.log({ itemGroup, average });
    return average.toFixed(1);
  });
};

const getSeries = (data, index, values) => {
  return index.map((i, ii) => {
    const item = data[i][0];

    if (item) {
      return {
        meta: item.time.hour + "h",
        value: values[ii]
      };
    } else {
      return "";
    }
  });
};

export default {
  getOnlyLast24hStats,
  groupStatsByHour,
  getAverage,
  getLabels,
  getSeries
};

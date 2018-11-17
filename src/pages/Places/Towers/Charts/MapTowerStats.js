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

  return only24h;
};

const groupStatsByDayAndHour = last24hStats => {
  let currentGroup = [];
  let finalGroup = [];
  let indexes = [];

  if (last24hStats.length) {
    const firtStat = last24hStats[0];
    let currentStatDay = firtStat.date.day;
    let currentStatHour = firtStat.time.hour;

    last24hStats.forEach(element => {
      const day = element.date.day;
      const hour = element.time.hour;

      if (day == currentStatDay && hour == currentStatHour) {
        currentGroup.push(element);
      } else {
        finalGroup[`${currentStatDay}_${currentStatHour}`] = currentGroup;
        indexes.push(`${currentStatDay}_${currentStatHour}`);
        currentGroup = [];
        currentStatDay = day;
        currentStatHour = hour;
      }
    });
  }

  return { stats: finalGroup, indexes: indexes };
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
    return average.toFixed(1);
  });
};

const getSeries = (data, index, values) => {
  return index.map((i, ii) => {
    const item = data[i][0];

    if (item) {
      return {
        meta: `${item.date.day}/${item.date.month} às ${item.time.hour}h`,
        value: values[ii]
      };
    } else {
      return "";
    }
  });
};

export default {
  getOnlyLast24hStats,
  groupStatsByDayAndHour,
  getAverage,
  getLabels,
  getSeries
};

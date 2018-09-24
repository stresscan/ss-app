import { getDateDiffInMinutes } from "@/utils/Dates";

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

const groupStatsByHour = last24hStats => {
  let currentGroup = [];
  let finalGroup = [];
  let indexs = [];

  if (last24hStats.length) {
    let currentDay = last24hStats[0].date.day;
    let currentTime = last24hStats[0].time.hour;

    last24hStats.forEach(element => {
      if (element.date.day == currentDay && element.time.hour == currentTime) {
        currentGroup.push(element);
      } else {
        finalGroup[`${currentDay}_${currentTime}`] = currentGroup;
        indexs.push(`${currentDay}_${currentTime}`);
        currentGroup = [];
        currentDay = element.date.day;
        currentTime = element.time.hour;
      }
    });
  }

  return { stats: finalGroup, index: indexs };
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
  groupStatsByHour,
  getAverage,
  getLabels,
  getSeries
};

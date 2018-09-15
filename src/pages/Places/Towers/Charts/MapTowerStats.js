import { getDateDiffInMinutes } from "@/utils/Dates/getDateDiffs";

const getOnlyLast24hStats = stats => {
  return stats.filter(item => {
    if (item.datetime) {
      return getDateDiffInMinutes(
        new Date(item.datetime).getTime(),
        Date.now()
      );
    }
  });
};

const groupStatsByHour = stats => {
  const statsGroupedByHours = [];

  const groupBy = hour => {
    return stats.filter(item => new Date(item.datetime).getHours() === hour);
  };

  for (let hour = 0; hour < 24; hour++) {
    statsGroupedByHours[hour] = groupBy(hour).map(item => {
      const date = new Date(item.datetime);
      return Object.assign(item, {
        date: {
          day: date.getDay(),
          month: date.getMonth(),
          year: date.getFullYear()
        },
        time: {
          hour: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds()
        }
      });
    });
  }

  return statsGroupedByHours;
};

const getAverage = (data, field) =>
  data.map(itemGroup => {
    let total = itemGroup
      .map(item => item[field])
      .reduce((acc, item) => acc + item, 0);

    return total / itemGroup.length;
  });

const get24hLabels = stats => {
  return stats.map(itemGroup => {
    if (itemGroup[0]) {
      return new Date(itemGroup[0].datetime).getHours();
    }
  });
};

const getSeries = (data, values) => {
  return data.map((item, i) => {
    if (item[0]) {
      return {
        meta: item[0].time.hour + "h",
        value: values[i]
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
  get24hLabels,
  getSeries
};

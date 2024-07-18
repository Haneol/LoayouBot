const ApiUtil = require("../utils/apiUtil");
const scheduleView = require("../views/scheduleView");
const logger = require("../utils/logger");

exports.scheduleRequest = async (interaction) => {
  const apiKey = interaction.loayouUser.apiKey;

  const api = new ApiUtil("https://developer-lostark.game.onstove.com", apiKey);

  try {
    const schedule = await api.get("/gamecontents/calendar");

    const islandData = filterSchedule(schedule, "모험 섬");
    const chaosGateData = filterSchedule(schedule, "카오스게이트");
    const fieldBossData = filterSchedule(schedule, "필드보스");

    const island = islandData.map((island) => {
      const name = island.ContentsName;
      const icon = island.ContentsIcon;
      const time = getNextClosestTime(island.StartTimes);
      const reward = getCurrentRewardItemType(island.RewardItems);
      return [name, icon, time, reward];
    });

    const chaosGate = [
      chaosGateData.length > 0,
      chaosGateData.length > 0
        ? getNextClosestTime(chaosGateData[0].StartTimes)
        : -1,
    ];

    const fieldBoss = [
      fieldBossData.length > 0,
      fieldBossData.length > 0
        ? getNextClosestTime(fieldBossData[0].StartTimes)
        : -1,
    ];

    await scheduleView.sendScheduleEmbedMsg(
      interaction,
      island,
      chaosGate,
      fieldBoss
    );
  } catch (e) {
    logger.error("ERROR schedule: ", e);
    await scheduleView.sendScheduleFailEmbedMsg(
      interaction,
      "스케줄을 불러오는데 실패하였습니다."
    );
  }
};

function filterSchedule(array, str) {
  const today = new Date().toISOString().split("T")[0];

  return array.filter((item) => {
    if (item.CategoryName !== str) return false;

    return item.StartTimes.some((startTime) => {
      const startDate = startTime.split("T")[0];
      return startDate === today;
    });
  });
}

function getCurrentRewardItemType(rewardItems) {
  const now = Math.floor(Date.now() / 1000);

  const itemTypeRegex = /골드|대양의 주화|카드 팩|실링/;

  for (const reward of rewardItems) {
    for (const item of reward.Items) {
      if (Array.isArray(item.StartTimes) && item.StartTimes.length > 0) {
        const isCurrentItem = item.StartTimes.some((startTime) => {
          const startTimestamp = Math.floor(
            new Date(startTime).getTime() / 1000
          );
          const nextStartTimestamp = item.StartTimes.find(
            (t) => Math.floor(new Date(t).getTime() / 1000) > now
          );
          return (
            startTimestamp <= now &&
            (!nextStartTimestamp ||
              Math.floor(new Date(nextStartTimestamp).getTime() / 1000) > now)
          );
        });

        if (isCurrentItem) {
          const match = item.Name.match(itemTypeRegex);
          if (match) {
            return match[0];
          }
        }
      }
    }
  }

  return null;
}

function getNextClosestTime(startTimes) {
  const now = Date.now();

  const futureTimes = startTimes
    .map((timeString) => new Date(timeString).getTime())
    .filter((time) => time > now);

  if (futureTimes.length === 0) {
    return null;
  }

  const nextClosestTime = Math.min(...futureTimes);

  return Math.floor(nextClosestTime / 1000);
}

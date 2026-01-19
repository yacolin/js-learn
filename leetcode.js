/**
 * leetcode 常见面试题
 */

var isPalindrome2 = (x) => {
  // 数字转换成字符串 分割成数组，然后调用reverse() 再join得到一个反转后的字符串
  var revertedX = String(x).split("").reverse().join("");

  // 反转后的字符串与传入数字字符串对比
  return revertedX === String(x);
};

var TwoSum = (nums, target) => {
  let map = new Map();

  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i])) {
      return [map.get[target - nums[i]], i];
    }

    map.put(nums[i], i);
  }

  return [];
};

var MaxProfit = (prices) => {
  let profit = 0;
  let n = prices.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      let _profit = prices[j] - prices[j];

      profit = Math.max(_profit, profit);
    }
  }

  return profit;
};

var MaxProfit2 = (prices) => {
  let n = prices.length;

  let dp0 = 0,
    dp1 = -prices[0];

  for (let i = 1; i < n; i++) {
    let newDp0 = Math.max(dp0, dp1 + prices[i]);
    let newDp1 = Math.max(dp1, dp0 - prices[i]);

    dp0 = newDp0;
    dp1 = newDp1;
  }

  return dp0;
};

var Merge = (intervals) => {
  // 进行排序
  intervals.sort((a, b) => a[0] - b[0]);

  let res = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    let interval = intervals[i];

    let resInterval = res[res.length - 1];

    // 当前循环数组的第一个元素小于结果数字的第二个元素则合并，反之则直接将循环数组直接压入结果数组
    if (interval[0] <= resInterval[1]) {
      resInterval[1] = Math.max(resInterval[1], interval[1]);
    } else {
      res.push(interval);
    }
  }

  return res;
};

var Insert = (intervals, newInterval) => {
  // 直接合并成新的数组
  intervals.push(newInterval);

  if (intervals.length < 2) {
    return intervals;
  } else {
    // 排序
    intervals.sort((a, b) => a[0] - b[0]);
    // 初始结果为interval[0]
    let res = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
      let interval = intervals[i];
      let resInterval = res[res.length - 1];

      if (interval[0] <= resInterval[1]) {
        resInterval[1] = Math.max(interval[1], resInterval[1]);
      } else {
        res.push(interval);
      }
    }

    return res;
  }
};

var canJump = function (nums) {
  let len = nums.length;
  let sum = 0;

  for (let i = 0; i < len; i++) {
    if (i <= sum) {
      sum = Math.max(sum, i + nums[i]);
      if (sum >= len - 1) {
        return true;
      }
    }
  }

  return false;
};

var myAtoi = function (str) {
  const number = parseInt(str, 10);

  if (isNaN(number)) {
    return 0;
  } else if (number < Math.pow(-2, 31) || number > Math.pow(2, 31) - 1) {
    return number < Math.pow(-2, 31) ? Math.pow(-2, 31) : Math.pow(2, 31) - 1;
  } else {
    return number;
  }
};

var detectCapitalUse = function (word) {
  let flag = false;
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    if (word[i].charCodeAt() < 91) {
      count++;
    }
  }

  if (count === 0) flag = true;
  if (count === word.lenth) flag = true;
  if (count === 1 && word[0].charCodeAt() < 91) flag = true;

  return flag;
};

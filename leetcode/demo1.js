/**
 * 11.盛水最多的容器 medium
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let l = 0;
  let r = height.length - 1;
  let area = 0;

  while (l < r) {
    // const h = Math.min(height[l], height[r]);
    const h = height[l] < height[r] ? height[l] : height[r];
    const w = r - l;
    // area = Math.max(area, h * w);
    area = area > h * w ? area : h * w;

    if (height[l] < height[r]) {
      l++;
    } else {
      r--;
    }
  }

  return area;
};

/**
 * 12.整数转罗马数字 medium
 * @param {number} num
 * @return {string}
 */
var intToRoman = function (num) {
  const map = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let roman = "";
  for (const [value, symbol] of map) {
    if (num >= value) {
      roman += symbol.repeat(Math.floor(num / value));
      num %= value;
    }
    if (num === 0) break;
  }
  return roman;
};


/**
 * 15.三数之和 medium
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const ans = [];
  const len = nums.length;
  if (len < 3) return ans;

  // 排序
  nums.sort((a, b) => a - b);

  for (var i = 0; i < len - 2; i++) {
    // 如果当前数字大于0，则三树之和一定大于0
    if (nums[i] > 0) break;

    // 去重
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let L = i + 1;
    let R = len - 1;

    while (L < R) {
      const sum = nums[i] + nums[L] + nums[R];

      if (sum === 0) {
        ans.push([nums[i], nums[L], nums[R]]);

        // 去重
        while (L < R && nums[L] === nums[L + 1]) L++;
        while (L < R && nums[R] === nums[R - 1]) R--;
        L++;
        R--;
      } else if (sum < 0) {
        L++;
      } else {
        R--;
      }
    }
  }
  return ans;
};

/**
 * 16. 最接近的三数之和 medium
 * @param {number[]} nums
 * @return {number[][]}
 */

var threeSumClosest = function (nums, target) {
  nums.sort((a, b) => a - b);
  const len = nums.length;
  let closestSum = nums[0] + nums[1] + nums[2];

  for (var i = 0; i < len - 2; i++) {
    let L = i + 1;
    let R = len - 1;
    while (L < R) {
      const sum = nums[i] + nums[L] + nums[R];
      if (sum === target) {
        return target;
      } else if (sum < target) {
        L++;
      } else {
        R--;
      }
      if (Math.abs(sum - target) < Math.abs(closestSum - target)) {
        closestSum = sum;
      }
    }
  }
};

// Definition for singly-linked list.
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 2.两数相加 链表相加 medium
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let head = null,
    tail = null;
  let carry = 0;

  while (l1 || l2) {
    const n1 = l1 ? l1.val : 0;
    const n2 = l2 ? l2.val : 0;
    const sum = n1 + n2 + carry;
    if (!head) {
      head = tail = new ListNode(sum % 10);
    } else {
      tail.next = new ListNode(sum % 10);
      tail = tail.next;
    }

    carry = Math.floor(sum / 10);
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }

  if (carry > 0) {
    tail.next = new ListNode(carry);
  }

  return head;
};

/**
 * 3.无重复字符的最长子串 medium
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const lastOccurrence = new Array(128).fill(-1); // 假设是ASCII字符
  let start = 0;
  let maxLen = 0;

  for (var i = 0; i < s.length; i++) {
    const charCode = s.charCodeAt(i);
    if (lastOccurrence[charCode] >= start) {
      start = lastOccurrence[charCode] + 1;
    }
    lastOccurrence[charCode] = i;
    maxLen = Math.max(maxLen, i - start + 1);
  }

  return maxLen;
};

/**
 * 4.寻找两个正序数组的中位数 hard
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
 * 算法的时间复杂度应该为 O(log (m+n)) 。
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  const totalLength = m + n;

  // 辅助函数：找到第K小的元素
  const findKElement = (k) => {
    let index1 = 0; // nums1的起始位置
    let index2 = 0; // nums2的起始位置

    while (true) {
      // 如果nums1已经全部排除，直接返回nums2的第k小元素
      if (index1 === m) {
        return nums2[index2 + k - 1];
      }

      // 如果nums2已经全部排除，直接返回nums1的第k小元素
      if (index2 === n) {
        return nums1[index1 + k - 1];
      }

      // 如果k === 1，返回nums1和nums2当前元素中较小的一个
      if (k === 1) {
        return Math.min(nums1[index1], nums2[index2]);
      }

      // 二分查找：比较nums1和nums2的第k/2个元素
      const halfK = Math.floor(k / 2);
      const newIndex1 = Math.min(index1 + halfK, m) - 1;
      const newIndex2 = Math.min(index2 + halfK, (m = n)) - 1;

      if (nums1[newIndex1] <= nums2[newIndex2]) {
        // 排除nums1的前半部分
        k -= newIndex1 - index1 + 1;
        index1 = newIndex1 + 1;
      } else {
        // 排除nums2的前半部分
        k -= newIndex2 - index2 + 1;
        index2 = newIndex2 + 1;
      }
    }
  };

  // 如果总长度是奇数，直接找第k小的数
  if (totalLength % 2 === 1) {
    const k = Math.floor(totalLength / 2) + 1;
    return findKElement(k);
  } else {
    // 如果总长度是奇数，找第k1 和 k2小的数，取平均值
    const k1 = totalLength / 2;
    const k2 = k1 + 1;
    return (findKElement(k1) + findKElement(k2)) / 2;
  }
};

var _findMedianSortedArrays = function (nums1, nums2) {
  // 合并数组然后从小到大排序
  let arr = [...nums1, ...nums2].sort((a, b) => a - b);

  let isOdd = arr.length % 2 === 1;
  let mid = Math.floor(arr.length / 2);

  let median;
  if (isOdd) {
    median = arr[mid];
  } else {
    median = (arr[mid] + arr[mid - 1]) / 2;
  }

  return median;
};

/**
 * 5.最长回文字符串 medium
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function (s) {
  if (s.length < 2) return s;

  let start = 0; // 最长回文字串的其实位置
  let maxLen = 1; // 最长回文字串的长度
  const n = s.length;

  for (var i = 0; i < n; ) {
    if (n - i < maxLen / 2) break; // 剩余长度不足以超过当前maxLen

    let left = i,
      right = i;

    // 跳过重复字符
    while (right < n - 1 && s[right + 1] === s[right]) {
      right++;
    }
    i = right + 1;

    // 扩展回文串
    while (left > 0 && right < n - 1 && s[left - 1] === s[right + 1]) {
      left--;
      right++;
    }

    const currentLen = right - left + 1;
    if (currentLen > maxLen) {
      maxLen = currentLen;
      start = left;
    }
  }
  return s.slice(start, start + maxLen);
};

/**
 * 121. 买卖股票的最佳时机 easy
 * @param {number[]} prices
 * @return {number}
 */
var MaxProfit = function (prices) {
  let profit = 0;
  let n = prices.length;

  for (var i = 0; i < n - 1; i++) {
    for (var j = i + 1; j < n; j++) {
      let _profit = prices[j] - prices[j];

      profit = Math.max(_profit, profit);
    }
  }

  return profit;
};

/**
 * 122. 买卖股票的最佳时机II medium
 * @param {number[]} prices
 * @return {number}
 */
var MaxProfitII = function (prices) {
  return prices.reduce(
    (acc, cur, i) =>
      cur - prices[i - 1] > 0 ? acc + cur - prices[i - 1] : acc,
    0
  );
};

/**
 * 8.字符串转换整数 (atoi) medium
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
  // 转换成数字
  const number = parseInt(s, 10);

  // INT极值
  let max = Math.pow(2, 31) - 1;
  let min = Math.min(-2, 31);

  if (isNaN(number)) {
    return 0;
  } else if (number < min || number > max) {
    return number < min ? min : max;
  } else {
    return number;
  }
};

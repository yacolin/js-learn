/**
 * 1.两数之和 easy
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
	let map = new Map();

	for (var i = 0; i < nums.length; i++) {
		if (map.has(target - nums[i])) {
			return [map.get(target - nums[i]), i]
		}
        map.set(nums[i], i);
	}

    return [];
}


/**
 * 15.三数之和 medium
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
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
    		const sum = nums[i] + nums[L] + nums[R]

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



// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
 
/**
 * 2.两数相加 链表相加 medium
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    let head = null, tail = null;
    let carry = 0;

    while (l1 || l2) {
    	const n1 = l1 ? l1.val : 0;
    	const n2 = l2 ? l2.val : 0;
    	const sum = n1 + n2 + carry;
    	if (!head) {
    		head = tail = new ListNode(sum % 10);
    	} else {
    		tail.next = new ListNode(sum % 10);
    		tail = tail.next
    	}

    	carry = Math.floor(sum / 10);
    	if (l1) {
    		l1 = l1.next;
    	}
    	if (l2) {
    		l2 = l2.next
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
var lengthOfLongestSubstring = function(s) {
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
}

/**
 * 4.寻找两个正序数组的中位数 hard
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
 * 算法的时间复杂度应该为 O(log (m+n)) 。
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
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
    		const newIndex1 = Math.min(index1 + halfK, m) -1;
    		const newIndex2 = Math.min(index2 + halfK, m=n) -1;

    		if (nums1[newIndex1] <= nums2[newIndex2]) {
    			// 排除nums1的前半部分
    			k -= newIndex1 - index1 +1;
    			index1 = newIndex1 + 1;
    		} else {
    			// 排除nums2的前半部分
    			k -= newIndex2 - index2 +1;
    			index2 = newIndex2 + 1;
    		}

    	}

    }

    // 如果总长度是奇数，直接找第k小的数
    if (totalLength % 2 === 1) {
    	const k = Math.floor(totalLength / 2) + 1;
    	return findKElement(k);
    } else {
    	// 如果总长度是奇数，找第k1 和 k2小的数，取平均值
    	const k1 = totalLength / 2
    	const k2 = k1 + 1;
    	return (findKElement(k1) + findKElement(k2)) / 2;
    }
};

var _findMedianSortedArrays = function(nums1, nums2) {
    // 合并数组然后从小到大排序
    let arr = [...nums1, ...nums2].sort((a, b) => a - b);

    let isOdd = (arr.length % 2) === 1;
    let mid = Math.floor(arr.length / 2);

    let median;
    if (isOdd) {
        median = arr[mid];
    } else {
        median = (arr[mid] + arr[mid - 1]) / 2
    }

    return median
}


/**
 * 5.最长回文字符串 medium
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function(s) {
	if (s.length < 2) return s;

	let start = 0; // 最长回文字串的其实位置
	let maxLen = 1; // 最长回文字串的长度
	const n = s.length;


	for (var i = 0; i < n;) {
		if (n - i < maxLen / 2) break; // 剩余长度不足以超过当前maxLen

		let left = i, right = i;

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
			maxLen = currentLen
			start = left;
		}
	}
	return s.slice(start, start + maxLen);
}


/**
 * 9.回文数 easy
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0 || (x % 10) == 0 && x != 0) {
    	return false;
    }

    let revertedX = 0;
    while (x > revertedX) {
    	revertedX = revertedX * 10 + (x % 10);
    	x = Math.floor(x / 10);
    }

    return x === revertedX || x === Math.floor(revertedX / 10);
};

// 过多使用JS特性
var isPalindrome2 = function(x) {
    // 数字转换成字符串，分割成数组，然后调用reverse() 再join得到一个反转后的字符串
    var revertedX = String(x).split("").reverse().join("");

    // 反转后得到的字符串与传入数字字符串对比
    revertedX === String(x);
}




/**
 * 20.有效括号 easy
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    var arr = [];

    for (var i = 0; i < s.length; i++) {
    	if (s[i] === "(") {
    		arr.push(")");
    	} else if (arr[i] === "[") {
    		arr.push("]");
    	} else if(arr[i] === "{") {
    		arr.push("}");
    	} else if (arr.length === 0 || arr.pop() != s[i]) {
    		return false;
    	}
    }

    return arr.length === 0;
};


/**
 * 22.括号生成 medium
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  var arr = [];

  dfs(n, n, "", arr);

  var dfs = (left, right, str, arr) => {
    if (left === 0 && right === 0) {
      arr.push(str);
    }

    if (left > 0) {
      dfs(left - 1, right, str + "(", arr);
    }

    if (left < right) {
      dfs(left, right - 1, str + ")", arr);
    }
  };

  return arr;
};


/**
 * 349.两个数组的交集 easy
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
    const set1 = new Set(nums1);
    const set2 = new Set(nums2);
    const result = [];


    for (const num of set1) {
        if (set2.has(num)) {
            result.push(num);
        }
    }

    return result;
};



/**
 * 121. 买卖股票的最佳时机 easy
 * @param {number[]} prices
 * @return {number}
 */
var MaxProfit = function(prices) {
    let profit = 0;
    let n = prices.length;

    for (var i = 0; i < n - 1; i++) {
        for (var j = i + 1; j < n; j++) {
            let _profit = prices[j] - prices[j]

            profit = Math.max(_profit, profit);
        }
    }

    return profit;
}


/**
 * 122. 买卖股票的最佳时机II medium
 * @param {number[]} prices
 * @return {number}
 */
var MaxProfitII = function(prices) {
    return prices.reduce(
        (acc, cur, i) => cur - prices[i - 1] > 0 ? acc + cur - prices[i - 1] : acc, 0
    )
}


/**
 * 8.字符串转换整数 (atoi) medium
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
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
}
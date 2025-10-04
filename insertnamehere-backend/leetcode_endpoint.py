from fastapi import APIRouter
import random

router = APIRouter()

# List of 5 LeetCode problems
LEETCODE_PROBLEMS = [
    {
        "title": "Two Sum",
        "type": "arrays",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "example_test_case": {
            "input": "nums = [2,7,11,15], target = 9",
            "output": "[0,1]",
            "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        "expected_solution": "Use a hash map to store complements while iterating.",
        "starter_code": """\
def twoSum(nums, target):
    # TODO: Implement solution
    pass

# Example usage:
# print(twoSum([2,7,11,15], 9))  # Expected output: [0,1]
""",
        "solutions": [
            {
                "approach": "Hash map / one-pass (optimal)",
                "code": "def twoSum(nums, target):\n    comp = {}\n    for i, v in enumerate(nums):\n        need = target - v\n        if need in comp:\n            return [comp[need], i]\n        comp[v] = i\n    return []\n",
                "time_complexity": "O(n)",
                "space_complexity": "O(n)"
            },
            {
                "approach": "Brute-force (check all pairs)",
                "code": "def twoSum_bruteforce(nums, target):\n    n = len(nums)\n    for i in range(n):\n        for j in range(i+1, n):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []\n",
                "time_complexity": "O(n^2)",
                "space_complexity": "O(1)"
            }
        ]
    },
    {
        "title": "Valid Parentheses",
        "type": "strings",
        "description": "Determine if a string containing only (), {}, and [] is valid.",
        "example_test_case": {
            "input": "s = \"()[]{}\"",
            "output": "true",
            "explanation": "All brackets are properly matched."
        },
        "expected_solution": "Use a stack to validate parentheses order.",
        "starter_code": """\
def isValid(s):
    # TODO: Implement validation logic
    pass

# Example usage:
# print(isValid("()[]{}"))  # Expected output: True
""",
        "solutions": [
            {
                "approach": "Stack with mapping (standard)",
                "code": "def isValid(s):\n    pair = {')':'(', ']':'[', '}':'{'}\n    stack = []\n    for ch in s:\n        if ch in pair:\n            if not stack or stack[-1] != pair[ch]:\n                return False\n            stack.pop()\n        else:\n            stack.append(ch)\n    return not stack\n",
                "time_complexity": "O(n)",
                "space_complexity": "O(n)"
            },
            {
                "approach": "Iterative pair-removal",
                "code": "def isValid_replace(s):\n    prev = None\n    while prev != s:\n        prev = s\n        s = s.replace('()','').replace('[]','').replace('{}','')\n    return s == ''\n",
                "time_complexity": "O(n^2)",
                "space_complexity": "O(n)"
            }
        ]
    },
    {
        "title": "Maximum Depth of Binary Tree",
        "type": "recursion",
        "description": "Return the maximum depth (height) of a binary tree.",
        "example_test_case": {
            "input": "root = [3,9,20,null,null,15,7]",
            "output": "3",
            "explanation": "The maximum depth is 3."
        },
        "expected_solution": "Use recursion: maxDepth = 1 + max(left, right).",
        "starter_code": """\
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def maxDepth(root):
    # TODO: Implement recursive solution
    pass

# Example usage:
# root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
# print(maxDepth(root))  # Expected output: 3
""",
        "solutions": [
            {
                "approach": "Recursive DFS",
                "code": "def maxDepth(root):\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n",
                "time_complexity": "O(n)",
                "space_complexity": "O(h)"
            },
            {
                "approach": "Iterative BFS (queue)",
                "code": "from collections import deque\n\ndef maxDepth_bfs(root):\n    if not root:\n        return 0\n    q = deque([root])\n    depth = 0\n    while q:\n        depth += 1\n        for _ in range(len(q)):\n            node = q.popleft()\n            if node.left:\n                q.append(node.left)\n            if node.right:\n                q.append(node.right)\n    return depth\n",
                "time_complexity": "O(n)",
                "space_complexity": "O(n)"
            }
        ]
    },
    {
        "title": "Reverse Linked List",
        "type": "linked-list",
        "description": "Reverse a singly linked list.",
        "example_test_case": {
            "input": "head = [1,2,3,4,5]",
            "output": "[5,4,3,2,1]",
            "explanation": "The linked list is reversed."
        },
        "expected_solution": "Iterate through and reverse node pointers.",
        "starter_code": """\
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # TODO: Implement iterative reversal
    pass

# Example usage:
# head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
# print(reverseList(head))  # Expected: 5 -> 4 -> 3 -> 2 -> 1
""",
        "solutions": [
            {
                "approach": "Iterative three-pointer",
                "code": "def reverseList(head):\n    prev = None\n    cur = head\n    while cur:\n        nxt = cur.next\n        cur.next = prev\n        prev = cur\n        cur = nxt\n    return prev\n",
                "time_complexity": "O(n)",
                "space_complexity": "O(1)"
            },
            {
                "approach": "Recursive reversal",
                "code": "def reverseList_recursive(head):\n    if not head or not head.next:\n        return head\n    p = reverseList_recursive(head.next)\n    head.next.next = head\n    head.next = None\n    return p\n",
                "time_complexity": "O(n)",
                "space_complexity": "O(n)"
            }
        ]
    },
    {
        "title": "Merge Two Sorted Lists",
        "type": "linked-list",
        "description": "Merge two sorted linked lists and return the head of the merged list.",
        "example_test_case": {
            "input": "list1 = [1,2,4], list2 = [1,3,4]",
            "output": "[1,1,2,3,4,4]",
            "explanation": "Lists are merged in sorted order."
        },
        "expected_solution": "Use dummy node and merge iteratively.",
        "starter_code": """\
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    # TODO: Implement merge logic
    pass

# Example usage:
# list1 = ListNode(1, ListNode(2, ListNode(4)))
# list2 = ListNode(1, ListNode(3, ListNode(4)))
# print(mergeTwoLists(list1, list2))  # Expected: 1 -> 1 -> 2 -> 3 -> 4 -> 4
""",
        "solutions": [
            {
                "approach": "Iterative with dummy node",
                "code": "def mergeTwoLists(l1, l2):\n    dummy = ListNode()\n    tail = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            tail.next = l1\n            l1 = l1.next\n        else:\n            tail.next = l2\n            l2 = l2.next\n        tail = tail.next\n    tail.next = l1 if l1 else l2\n    return dummy.next\n",
                "time_complexity": "O(n + m)",
                "space_complexity": "O(1)"
            },
            {
                "approach": "Recursive merge",
                "code": "def mergeTwoLists_recursive(l1, l2):\n    if not l1:\n        return l2\n    if not l2:\n        return l1\n    if l1.val <= l2.val:\n        l1.next = mergeTwoLists_recursive(l1.next, l2)\n        return l1\n    else:\n        l2.next = mergeTwoLists_recursive(l1, l2.next)\n        return l2\n",
                "time_complexity": "O(n + m)",
                "space_complexity": "O(n + m)"
            }
        ]
    }
]

@router.get("/api/leetcode")
async def get_random_leetcode_problem():
    """
    Returns a random LeetCode problem from the predefined list.
    """
    random_problem = random.choice(LEETCODE_PROBLEMS)
    return random_problem

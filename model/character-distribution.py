import matplotlib.pyplot as plt

def chance_five_stars_character(n):
    soft_stack = max(0, n - 72)
    return 0.00600 + soft_stack * 0.06

store = 1
vals = []

for i in range(91):
    if i != 0:
        store *= 1 - chance_five_stars_character(i - 1)
    val = store * chance_five_stars_character(i)
    vals.append(val)

plt.figure(figsize=(10, 6))
plt.plot(range(91), vals, marker='o', linestyle='-', color='blue')
plt.title('Probability of Getting a 5-Star Character at Each Warp (0-90)')
plt.xlabel('Warp Number (Pull Index)')
plt.ylabel('Probability')
plt.grid(True)
plt.tight_layout()
plt.show()
